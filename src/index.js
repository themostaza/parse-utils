/* flow */
import { chunk, compact, concat, difference, flatten, isArray, isEmpty, isNil, omit, range } from 'lodash'

let Parse = global.Parse

const PARSE_SPECIFIC_ATTRIBUTES = ['__type', 'className', 'objectId', 'createdAt', 'updatedAt', 'ACL']

type ParseObject = Object
type ParseUser = Object
type ParsePointer = Object
type ParseRole = Object
type ParseQuery = Object

/**
 * Set the Parse library to use (node/react-native).
 * @param {Object} parseLib - The Parse library instance.
 */
export const setParseLib = (parseLib: Object) => {
  Parse = parseLib
}

/**
 * Initialize the Parse SDK.
 * @category Synchronous.
 * @param {String} serverURL
 * @param {String} appId
 * @param {String} masterKey
 */
export const initializeParseSDK = (serverURL: string, appId: string, masterKey: string): void => {
  Parse.initialize(appId, '', masterKey)
  Parse.serverURL = serverURL
}

/**
 * Create a pointer to a Parse object given its id and the class name.
 * @category Synchronous.
 * @param {String} className - The class name of the Parse object.
 * @param {String} objectId - The id of the Parse object.
 * @return {ParsePointer} Pointer to the Parse object.
 */
export const createPointerFromId = (className: string, objectId: string): ParsePointer => {
  const objClass = Parse.Object.extend(className)
  const obj = new objClass()
  obj.id = objectId
  return obj
}

/**
 * Strip off the Parse specific attributes from an Object.
 * @category Synchronous.
 * @param {Object} object - Plain Javascript representation of a Parse Object.
 * @return {Object} Object without the Parse specific attributes.
 */
export const getObjectWithoutParseAttributes = (object: Object): Object => {
  return omit({ ...object }, PARSE_SPECIFIC_ATTRIBUTES)
}

/**
 * Set the value of Parse object field (it mutates the object).
 * @category Synchronous.
 * @param {ParseObject} parseObject - The Parse object with the field that must be set.
 * @param {String} fieldName - The name of the field.
 * @param {Number|Boolean|String|Array|ParseObject} fieldValue - The value of the field.
 */
export const setField = (parseObject: ParseObject, fieldName: string, fieldValue: any): void => {
  if (!isNil(fieldValue)) {
    parseObject.set(fieldName, fieldValue, {})
  } else {
    parseObject.unset(fieldName)
  }
}

/**
 * Set the value of Parse object field to a Parse pointer (it mutates the object).
 * @category Synchronous.
 * @param {ParseObject} parseObject - The Parse object with the field that must be set.
 * @param {String} fieldName - The name of the field.
 * @param {String} pointerId - The objectId of the object pointed by the Parse pointer.
 * @param {String} pointerClassName - The class name of the pointed object.
 */
export const setPointer = (parseObject: ParseObject, fieldName: string, pointerId: string, pointerClassName: string): void => {
  const pointer = createPointerFromId(pointerClassName, pointerId)
  setField(parseObject, fieldName, pointer)
}

/**
 * Set the value of Parse object field to an array of pointers (it mutates the object).
 * @category Synchronous.
 * @param {ParseObject} parseObject - The object that with field that must be set.
 * @param {String} fieldName - The name of the field
 * @param {String[]} pointersIds - The objectIds of the objects pointed by the Parse pointers.
 * @param {String} pointersClassName - The class name of the pointed objects.
 */
export const setArrayOfPointers = (parseObject: ParseObject, fieldName: string, pointersIds: Array<string>, pointersClassName: string): void => {
  let arrayOfPointers
  if (isArray(pointersIds) && !isEmpty(pointersIds)) {
    const dirtyArrayOfPointers = pointersIds.map((objectId) => {
      return createPointerFromId(pointersClassName, objectId)
    })
    arrayOfPointers = compact(dirtyArrayOfPointers)
  }
  setField(parseObject, fieldName, arrayOfPointers)
}

/**
 * Upload a file.
 * @category Asynchronous.
 * @param {String} fileName
 * @param {File} file
 * @return {ParseObject} The uploaded file.
 */
export const uploadFile = async (fileName: string, file: Object): ParseObject => {
  return await new Parse.File(fileName, file).save()
}

/**
 * Get a User given its email.
 * @category Asynchronous.
 * @param {String} userEmail
 * @return {ParseUser} The User object.
 */
export const getUserByEmail = async (userEmail: string): ParseUser => {
  const User = Parse.Object.extend('_User')
  return await new Parse.Query(User)
    .equalTo('email', userEmail)
    .first()
}

/**
 * Get a User given its id.
 * @category Asynchronous.
 * @param {String} userId
 * @return {ParseUser} The User object.
 */
export const getUserById = async (userId: string): ParseUser => {
  const User = Parse.Object.extend('_User')
  return await new Parse.Query(User)
    .equalTo('objectId', userId)
    .first()
}

/**
 * Get a Role given its name.
 * @category Asynchronous.
 * @param {String} roleName
 * @return {ParseObject} The Role object.
 */
export const getRoleByName = async (roleName: string): ParseRole => {
  const Role = Parse.Object.extend('_Role')
  return await new Parse.Query(Role)
    .equalTo('name', roleName)
    .first()
}

/**
 * Execute a "find" Parse Query regardless of the limit imposed by Parse (which is 500).
 * @category Asynchronous.
 * @param {ParseQuery} parseQuery - The "find" Parse Query that will be executed.
 * @param {Object} findOptions - Options passed to the "find" function.
 * @return {ParseObject[]} The array with the found Parse objects.
 */
export const findAll = async (parseQuery: ParseQuery, findOptions: ?Object): Array<ParseObject> => {
  const PAGE_SIZE = 500
  const count = await parseQuery.count({})
  const pagesCount = Math.ceil(count / PAGE_SIZE)
  const pages = range(0, pagesCount)
  return flatten(await Promise.all(
    pages.map((page) => {
      return parseQuery
        .skip(page * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .find(findOptions)
    })
  ))
}

/**
 * Execute a "saveAll" Parse Query splitting in chunks the saveAll instructions.
 * @category Asynchronous.
 * @param {ParseObject[]} parseObjects - The array of Parse object that will be saved.
 * @param {Object} saveOptions - Options passed to the "saveAll" function.
 * @param {Number} chunkSize - The chunk size of the promises.
 * @return {ParseObject[]} An array with the saved Parse Objects
 */
export const saveAllInChunks = async (parseObjects: Array<ParseObject>, saveOptions: ?Object, chunkSize: ?number = 200): Array<ParseObject> => {
  const objectsChunks = chunk(parseObjects, chunkSize)
  return await Promise.all(objectsChunks.map((obj) => Parse.Object.saveAll(obj, saveOptions)))
}

/**
 * Create a Role with the specified name (only if it doesn't alrady exists).
 * @category Asynchronous.
 * @param {String} roleName - The Role name.
 * @param {Object} saveOptions - Options passed to the "save" command.
 * @return {ParseRole} - The created Role (undefined if the role already exists).
 */
export const createRoleIfNotExists = async (roleName: string, saveOptions: Object): ParseRole => {
  const Role = Parse.Object.extend('_Role')
  const doesRoleExists = await new Parse.Query(Role)
    .equalTo('name', roleName)
    .first()
  if (doesRoleExists) {
    return undefined
  } else {
    const role = new Role()
    role.set('name', roleName)
    const acl = new Parse.ACL()
    acl.setPublicReadAccess(true)
    acl.setPublicWriteAccess(false)
    role.setACL(acl)
    return await role.save({}, saveOptions)
  }
}

/**
 * Check if the the user is in a certain role.
 * @category Asynchronous.
 * @param {String} userId - The user objectId.
 * @param {String} roleName - The role name.
 * @return {Boolean} - Is the user in the role?
 */
export const isUserInRole = async (userId: string, roleName: string): boolean => {
  const user = createPointerFromId('_User', userId)
  const isInRole = await new Parse.Query(Parse.Role)
    .equalTo('name', roleName)
    .equalTo('users', user)
    .first()
  return !isEmpty(isInRole)
}

/**
 * Given an array of schemas of classes loads them in Parse Server.
 * @category Asynchronous.
 * @param {Object} parseServerDb - The Parse Server DB instance.
 * @param {Array} schemas - Array of schemas in the format [{ name: {}, schema: {}, permissions: {} }, ...].
 * @param {Boolean} shouldUpdate - Should the class be updated if it already exists?
 */
export const loadClassesFromSchemas = async (parseServerDb: Object, schemas: Array<Object> = [], shouldUpdate: ?boolean = true) => {
  // Get the Parse Server DB Schema
  const parseServerDbSchema = await parseServerDb.loadSchema()
  // Function that load a class in Parse Server
  const loadClass = async(className, classSchema, classPermissions) => {
    try {
      await parseServerDbSchema.addClassIfNotExists(className, classSchema)
      await parseServerDbSchema.updateClass(className, {}, classPermissions)
    } catch (err) {
      if (err.code === 103) {
        if (shouldUpdate) {
          const mergedClassSchema = getSchemaChanges(className, classSchema)
          await parseServerDbSchema.updateClass(className, mergedClassSchema, classPermissions)
        }
      } else {
        throw err
      }
    }
  }
  // Function that sanitize a class that must be updated in Parse Server
  const getSchemaChanges = (className, classSchema) => {
    const deletedFields = difference(
      Object.keys(parseServerDbSchema.data[className]),
      concat(Object.keys(classSchema), PARSE_SPECIFIC_ATTRIBUTES)
    )
    const newFields = difference(
      concat(Object.keys(classSchema), PARSE_SPECIFIC_ATTRIBUTES),
      Object.keys(parseServerDbSchema.data[className])
    )
    const newClassSchema = {}
    for (const field of deletedFields) newClassSchema[field] = { ...parseServerDbSchema.data[className][field], __op: 'Delete' }
    for (const field of newFields) newClassSchema[field] = { ...classSchema[field], __op: 'Insert' }
    return newClassSchema
  }
  // Load all the classes in Parse Server
  await Promise.all(schemas.map(({ name, schema, permissions }) => loadClass(name, schema, permissions)))
}

export default {
  setParseLib,
  initializeParseSDK,
  uploadFile,
  createPointerFromId,
  getObjectWithoutParseAttributes,
  getUserByEmail,
  getUserById,
  getRoleByName,
  loadClassesFromSchemas,
  setField,
  setPointer,
  setArrayOfPointers,
  findAll,
  saveAllInChunks,
  createRoleIfNotExists,
  isUserInRole
}
