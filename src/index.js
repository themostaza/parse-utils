import Parse from 'parse'
import { chunk, compact, flatten, isArray, isEmpty, isNil, range } from 'lodash'

const User = Parse.Object.extend('_User')
const Role = Parse.Object.extend('_Role')

export const initializeParseSDK = (appId, serverURL) => {
  Parse.initialize(appId)
  Parse.serverURL = serverURL
}

export const uploadFile = async (fileName, file) => {
  const uploadedFile = await new Parse.File(fileName, file).save()
  return uploadedFile
}

export const getPointerFromId = (className, objectId) => {
  const objClass = Parse.Object.extend(className)
  const obj = new objClass()
  obj.id = objectId
  return obj
}

export const setField = (parseObject, fieldName, fieldValue) => {
  if (!isNil(fieldValue)) {
    parseObject.set(fieldName, fieldValue)
  } else {
    parseObject.unset(fieldName)
  }
}

export const setPointer = (parseObject, fieldName, fieldValue, pointerClassName) => {
  const pointer = (fieldValue && fieldValue.objectId)
    ? getPointerFromId(pointerClassName, fieldValue.objectId)
    : undefined
  setField(parseObject, fieldName, pointer)
}

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

export const getRole = async (roleName) => {
  return await new Parse.Query(Role)
    .equalTo('name', roleName)
    .first()
}

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

export const createAll = async (parseObjects, saveOptions, chunkSize = 200) => {
  const objectsChunks = chunk(parseObjects, chunkSize)
  return await Promise.all(objectsChunks.map((obj) => Parse.Object.saveAll(obj, saveOptions)))
}

export default {
  initializeParseSDK,
  uploadFile,
  getPointerFromId,
  setField,
  setPointer,
  setArrayOfPointers,
  getRole,
  findAll,
  createAll
}
