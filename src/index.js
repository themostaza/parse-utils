import { chunk, compact, flatten, isArray, isEmpty, isNil, range } from 'lodash'

let Parse = global.Parse

/**
 * Set the Parse library to use (node/react-native)
 * @param {Object} The Parse library instance
 */
export const setParseLib = (parseLib) => {
  Parse = parseLib
}

/**
 * Initialize the Parse SDK.
 * @category Synchronous.
 * @param {String} appId
 * @param {String} serverURL
 */
export const initializeParseSDK = (appId, serverURL) => {
  Parse.initialize(appId)
  Parse.serverURL = serverURL
}

/**
 * Create a pointer to a Parse object given its id and the class name
 * @category Synchronous.
 * @param {String} className - The class name of the Parse object.
 * @param {String} objectId - The id of the Parse object.
 * @return {ParseObject} Pointer to the Parse object.
 */
export const createPointerFromId = (className, objectId) => {
  const objClass = Parse.Object.extend(className)
  const obj = new objClass()
  obj.id = objectId
  return obj
}

/**
 * Set the value of Parse object field (it mutates the object).
 * @category Synchronous.
 * @param {ParseObject} parseObject - The Parse object with the field that must be set.
 * @param {String} fieldName - The name of the field.
 * @param {Any} fieldValue - The value of the field.
 */
export const setField = (parseObject, fieldName, fieldValue) => {
  if (!isNil(fieldValue)) {
    parseObject.set(fieldName, fieldValue)
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
 * @param {Object} pointerClassName - The class name of the pointed object.
 */
export const setPointer = (parseObject, fieldName, pointerId, pointerClassName) => {
  const pointer = createPointerFromId(pointerClassName, pointerId)
  setField(parseObject, fieldName, pointer)
}

/**
 * Set the value of Parse object field to an array of pointers (it mutates the object).
 * @category Synchronous.
 * @param {ParseObject} parseObject - The object that with field that must be set.
 * @param {String} fieldName - The name of the field
 * @param {String[]} pointersIds - The objectIds of the objects pointed by the Parse pointers.
 * @param {Object} pointersClassName - The class name of the pointed objects.
 */
export const setArrayOfPointers = (parseObject, fieldName, pointersIds, pointersClassName) => {
  let arrayOfPointers
  if (isArray(pointersIds) && !isEmpty(pointersIds)) {
    const dirtyArrayOfPointers = pointersIds.map((objectId) => {
      return createPointerFromId(pointersIds, objectId)
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
export const uploadFile = async (fileName, file) => {
  const uploadedFile = await new Parse.File(fileName, file).save()
  return uploadedFile
}

/**
 * Get a User given its email.
 * @category Asynchronous.
 * @param {String} email
 * @return {ParseObject} The User object.
 */
export const getUserByEmail = async (userEmail) => {
  const User = Parse.Object.extend('_User')
  return await new Parse.Query(User)
    .equalTo('email', userEmail)
    .first()
}

/**
 * Get a User given its id.
 * @category Asynchronous.
 * @param {String} objectId
 * @return {ParseObject} The User object.
 */
export const getUserById = async (userId) => {
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
export const getRoleByName = async (roleName) => {
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
export const findAll = async (parseQuery, findOptions) => {
  const PAGE_SIZE = 500
  const count = await parseQuery.count()
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
export const saveAllInChunks = async (parseObjects, saveOptions, chunkSize = 200) => {
  const objectsChunks = chunk(parseObjects, chunkSize)
  return await Promise.all(objectsChunks.map((obj) => Parse.Object.saveAll(obj, saveOptions)))
}

/**
 * Create a Role with the specified name (only if it doesn't alrady exists).
 * @category Asynchronous.
 * @param {String} roleName - The Role name.
 * @param {Object} saveOptions - Options passed to the "save" command.
 * @return {ParseObject} - The created Role (undefined if the role already exists).
 */
export const createRoleIfNotExists = async (roleName, saveOptions) => {
  const Role = Parse.Object.extend('_Role')
  const doesRoleExists = await new Parse.Query(Role)
    .equalTo('name', roleName)
    .first()
  if (doesRoleExists) {
    return undefined
  } else {
    const role = new Role()
    role.set('name', roleName)
    return await role.save({}, saveOptions)
  }
}

/**
 * Check if the the user is in a certain role.
 * @category Asynchronous.
 * @param {String} userId - The user objectId.
 * @param {String} roleName - The role name.
 * @return {Bool} - Is the user in the role?
 */
export const isUserInRole = async (userId, roleName) => {
  const user = createPointerFromId('_User', userId)
  const isInRole = await new Parse.Query(Parse.Role)
    .equalTo('name', roleName)
    .equalTo('users', user)
    .first()
  return !isEmpty(isInRole)
}

export default {
  setParseLib,
  initializeParseSDK,
  uploadFile,
  createPointerFromId,
  getUserByEmail,
  getUserById,
  getRoleByName,
  setField,
  setPointer,
  setArrayOfPointers,
  findAll,
  saveAllInChunks,
  createRoleIfNotExists,
  isUserInRole
}
