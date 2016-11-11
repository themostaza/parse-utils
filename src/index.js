/* @flow */
import Parse from 'parse'
import { chunk, compact, flatten, isArray, isEmpty, isNil, range } from 'lodash'

const User = Parse.Object.extend('_User')
const Role = Parse.Object.extend('_Role')

/**
 * Initialize the Parse SDK
 * @param {String} appId
 * @param {String} serverURL
 */
export const initializeParseSDK = (appId, serverURL) => {
  Parse.initialize(appId)
  Parse.serverURL = serverURL
}

/**
 * Upload a file
 * @param {String} fileName
 * @param {File} file
 * @return {ParseObject} The uploaded file
 */
export const uploadFile = async (fileName, file) => {
  const uploadedFile = await new Parse.File(fileName, file).save()
  return uploadedFile
}

/**
 * Create a pointer to a Parse object given its id and the class name
 * @param {String} className - The class name of the Parse object
 * @param {String} objectId - The id of the Parse object
 * @return {ParseObject} Pointer to the Parse object
 */
export const getPointerFromId = (className, objectId) => {
  const objClass = Parse.Object.extend(className)
  const obj = new objClass()
  obj.id = objectId
  return obj
}

/**
 * Set the value of a a field of a Parse object (it mutates the object)
 * @param {ParseObject} parseObject - The object that has the field that must be set
 * @param {String} fieldName - The name of the field
 * @param {String|Bool|Object|Number} fieldValue - The value of the field
 */
export const setField = (parseObject, fieldName, fieldValue) => {
  if (!isNil(fieldValue)) {
    parseObject.set(fieldName, fieldValue)
  } else {
    parseObject.unset(fieldName)
  }
}

/**
 * Set the value of a a field of a Parse object to a pointer (it mutates the object)
 * @param {ParseObject} parseObject - The object that has the field that must be set
 * @param {String} fieldName - The name of the field
 * @param {Object} fieldValue - A JS object rapresentation of the pointer
 * @param {Object} pointerClassName - The pointer class name
 */
export const setPointer = (parseObject, fieldName, fieldValue, pointerClassName) => {
  const pointer = (fieldValue && fieldValue.objectId)
    ? getPointerFromId(pointerClassName, fieldValue.objectId)
    : undefined
  setField(parseObject, fieldName, pointer)
}

/**
 * Set the value of a a field of a Parse object to an array of pointers (it mutates the object)
 * @param {ParseObject} parseObject - The object that has the field that must be set
 * @param {String} fieldName - The name of the field
 * @param {Object} fieldValue - An array of JS objects rapresentation of the pointers
 * @param {Object} pointerClassName - The pointers class name
 */
export const setArrayOfPointers = (parseObject, fieldName, fieldValues, pointerClassName) => {
  let arrayOfPointers
  if (isArray(fieldValues) && !isEmpty(fieldValues)) {
    const dirtyArrayOfPointers = fieldValues.map((el) => {
      return (el && el.objectId)
        ? getPointerFromId(pointerClassName, el.objectId)
        : undefined
    })
    arrayOfPointers = compact(dirtyArrayOfPointers)
  }
  setField(parseObject, fieldName, arrayOfPointers)
}

/**
 * Get a User given its email
 * @param {String} email
 * @return {ParseObject} The User object
 */
export const getUserByEmail = async (userEmail) => {
  return await new Parse.Query(User)
    .equalTo('email', userEmail)
    .first()
}

/**
 * Get a User given its id
 * @param {String} objectId
 * @return {ParseObject} The User object
 */
export const getUserById = async (userId) => {
  return await new Parse.Query(User)
    .equalTo('objectId', userId)
    .first()
}

/**
 * Get a Role given its name
 * @param {String} roleName
 * @return {ParseObject} The Role object
 */
export const getRoleByName = async (roleName) => {
  return await new Parse.Query(Role)
    .equalTo('name', roleName)
    .first()
}

/**
 * Execute a "find" Parse Query regardless of find limit imposed by Parse (which is 500)
 * @param {ParseQuery} parseQuery - The "find" Parse Query that will be executed
 * @param {Object} findOptions - options passed to the "find" command
 * @return {Array of ParseObject} An array with the found Parse Objects
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
 * Execute a "saveAll" Parse Query regardless of find limit imposed by Parse
 * @param {Array of ParseObject} parseObjects - The array of object that will be saved
 * @param {Object} saveOptions - options passed to the "saveAll" command
 * @param {Number} chunkSize - the size of chunk of the promises (tweak it for memory/perfomance)
 * @return {Array of ParseObject} An array with the saved Parse Objects
 */
export const saveAll = async (parseObjects, saveOptions, chunkSize = 200) => {
  const objectsChunks = chunk(parseObjects, chunkSize)
  return await Promise.all(objectsChunks.map((obj) => Parse.Object.saveAll(obj, saveOptions)))
}

/**
 * Create a Role with the specified name (only if it doesn't alrady exists)
 * @param {String} roleName - The Role name
 * @param {Object} saveOptions - options passed to the "save" command
 * @return {ParseObject} - The created Role (undefined if the role already exists)
 */
export const createRoleIfNotExists = async (roleName, saveOptions) => {
  const doesRoleExists = await new Parse.Query(Role)
    .equalTo('name', roleName)
    .first()
  if (doesRoleExists) {
    return undefined
  } else {
    const role = new Role()
    return await role.save({}, saveOptions)
  }
}

/**
 * Check if the the user is in a certain role
 * @param {String} userId - The user objectId
 * @param {String} roleName - The role name
 * @return {Bool} - Is the user in the ole?
 */
export const isUserInRole = async (userId, roleName) => {
  const user = pointerFromId('_User', userId)
  const isInRole = await new Parse.Query(Parse.Role)
    .equalTo('name', roleName)
    .equalTo('users', user)
    .first()
  return !isEmpty(isInRole)
}

export default {
  initializeParseSDK,
  uploadFile,
  getPointerFromId,
  getUserByEmail,
  getUserById,
  getRoleByName,
  setField,
  setPointer,
  setArrayOfPointers,
  findAll,
  createAll,
  createRoleIfNotExists,
  isUserInRole
}
