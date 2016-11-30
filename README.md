# parse-utils <img src="https://pbs.twimg.com/profile_images/674770932607483904/68wTsXcT.png" width="110" align="left">
#### Parse JS SDK and Parse-Server utilities
<br/>

# Setup
This library is available on npm, install it with: `npm install --save parse-utils`

# API
<dl>
<dt><a href="#setParseLib">setParseLib(parseLib)</a></dt>
<dd><p>Set the Parse library to use (node/react-native).</p>
</dd><dl>
<dt><a href="#initializeParseSDK">initializeParseSDK(appId, serverURL)</a></dt>
<dd><p>Initialize the Parse SDK.</p>
</dd>
<dt><a href="#createPointerFromId">createPointerFromId(className, objectId)</a> ⇒ <code>ParseObject</code></dt>
<dd><p>Create a pointer to a Parse object given its id and the class name</p>
</dd>
<dt><a href="#getObjectWithoutParseAttributes">getObjectWithoutParseAttributes(object)</a></dt> ⇒ <code>Object</code></dt>
<dd><p>Strip off the Parse specific attributes from an Object</p>
</dd>
<dt><a href="#setField">setField(parseObject, fieldName, fieldValue)</a></dt>
<dd><p>Set the value of Parse object field (it mutates the object).</p>
</dd>
<dt><a href="#setPointer">setPointer(parseObject, fieldName, pointerId, pointerClassName)</a></dt>
<dd><p>Set the value of Parse object field to a Parse pointer (it mutates the object).</p>
</dd>
<dt><a href="#setArrayOfPointers">setArrayOfPointers(parseObject, fieldName, pointersIds, pointersClassName)</a></dt>
<dd><p>Set the value of Parse object field to an array of pointers (it mutates the object).</p>
</dd>
<dt><a href="#uploadFile">uploadFile(fileName, file)</a> ⇒ <code>ParseObject</code></dt>
<dd><p>Upload a file.</p>
</dd>
<dt><a href="#getUserByEmail">getUserByEmail(userEmail)</a> ⇒ <code>ParseObject</code></dt>
<dd><p>Get a User given its email.</p>
</dd>
<dt><a href="#getUserById">getUserById(userId)</a> ⇒ <code>ParseObject</code></dt>
<dd><p>Get a User given its id.</p>
</dd>
<dt><a href="#getRoleByName">getRoleByName(roleName)</a> ⇒ <code>ParseObject</code></dt>
<dd><p>Get a Role given its name.</p>
</dd>
<dt><a href="#findAll">findAll(parseQuery, findOptions)</a> ⇒ <code>Array.&lt;ParseObject&gt;</code></dt>
<dd><p>Execute a &quot;find&quot; Parse Query regardless of the limit imposed by Parse (which is 500).</p>
</dd>
<dt><a href="#saveAllInChunks">saveAllInChunks(parseObjects, saveOptions, chunkSize)</a> ⇒ <code>Array.&lt;ParseObject&gt;</code></dt>
<dd><p>Execute a &quot;saveAll&quot; Parse Query splitting in chunks the saveAll instructions.</p>
</dd>
<dt><a href="#createRoleIfNotExists">createRoleIfNotExists(roleName, saveOptions)</a> ⇒ <code>ParseObject</code></dt>
<dd><p>Create a Role with the specified name (only if it doesn&#39;t alrady exists).</p>
</dd>
<dt><a href="#isUserInRole">isUserInRole(userId, roleName)</a> ⇒ <code>Bool</code></dt>
<dd><p>Check if the the user is in a certain role.</p>
</dd>
<dt><a href="#loadClassesFromSchemas">loadClassesFromSchemas(parseServerDb, schemas, shouldUpdate)</a></dt>
<dd><p>Given an array of schemas of classes loads them in Parse Server.</p>
</dd>
</dl>

## setParseLib
Set the Parse library to use (node/react-native).

**Category**: Synchronous.

| Param | Type | Description |
| --- | --- | --- |
| parseLib | <code>Object</code> | The Parse library instance. |

<a name="setParseLib"></a>

## initializeParseSDK
Initialize the Parse SDK.

**Category**: Synchronous.

| Param | Type |
| --- | --- |
| appId | <code>String</code> |
| serverURL | <code>String</code> |

<a name="createPointerFromId"></a>

## createPointerFromId ⇒ <code>ParseObject</code>
Create a pointer to a Parse object given its id and the class name.

**Returns**: <code>ParseObject</code> - Pointer to the Parse object.  
**Category**: Synchronous.

| Param | Type | Description |
| --- | --- | --- |
| className | <code>String</code> | The class name of the Parse object. |
| objectId | <code>String</code> | The id of the Parse object. |

<a name="setField"></a>

## getObjectWithoutParseAttributes ⇒ <code>Object</code>
Strip off the Parse specific attributes from an Object.

**Returns**: <code>Object</code> - Object without the Parse specific attributes.
**Category**: Synchronous.

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Plain Javascript representation of a Parse Object. |

<a name="getObjectWithoutParseAttributes"></a>

## setField
Set the value of Parse object field (it mutates the object).

**Category**: Synchronous.

| Param | Type | Description |
| --- | --- | --- |
| parseObject | <code>ParseObject</code> | The Parse object with the field that must be set. |
| fieldName | <code>String</code> | The name of the field. |
| fieldValue | <code>Number,Boolean,String,Array,ParseObject</code> | The value of the field. |

<a name="setPointer"></a>

## setPointer
Set the value of Parse object field to a Parse pointer (it mutates the object).

**Category**: Synchronous.

| Param | Type | Description |
| --- | --- | --- |
| parseObject | <code>ParseObject</code> | The Parse object with the field that must be set. |
| fieldName | <code>String</code> | The name of the field. |
| pointerId | <code>String</code> | The objectId of the object pointed by the Parse pointer. |
| pointerClassName | <code>String</code> | The class name of the pointed object. |

<a name="setArrayOfPointers"></a>

## setArrayOfPointers
Set the value of Parse object field to an array of pointers (it mutates the object).

**Category**: Synchronous.

| Param | Type | Description |
| --- | --- | --- |
| parseObject | <code>ParseObject</code> | The object that with field that must be set. |
| fieldName | <code>String</code> | The name of the field |
| pointersIds | <code>Array.&lt;String&gt;</code> | The objectIds of the objects pointed by the Parse pointers. |
| pointersClassName | <code>String</code> | The class name of the pointed objects. |

<a name="uploadFile"></a>

## uploadFile ⇒ <code>ParseObject</code>
Upload a file.

**Returns**: <code>ParseObject</code> - The uploaded file.  
**Category**: Asynchronous.

| Param | Type |
| --- | --- |
| fileName | <code>String</code> |
| file | <code>File</code> |

<a name="getUserByEmail"></a>

## getUserByEmail ⇒ <code>ParseObject</code>
Get a User given its email.

**Returns**: <code>ParseObject</code> - The User object.  
**Category**: Asynchronous.

| Param | Type |
| --- | --- |
| userEmail | <code>String</code> |

<a name="getUserById"></a>

## getUserById ⇒ <code>ParseObject</code>
Get a User given its id.

**Returns**: <code>ParseObject</code> - The User object.  
**Category**: Asynchronous.

| Param | Type |
| --- | --- |
| objectId | <code>String</code> |

<a name="getRoleByName"></a>

## getRoleByName ⇒ <code>ParseObject</code>
Get a Role given its name.

**Returns**: <code>ParseObject</code> - The Role object.  
**Category**: Asynchronous.

| Param | Type |
| --- | --- |
| roleName | <code>String</code> |

<a name="findAll"></a>

## findAll ⇒ <code>Array.&lt;ParseObject&gt;</code>
Execute a "find" Parse Query regardless of the limit imposed by Parse (which is 500).

**Returns**: <code>Array.&lt;ParseObject&gt;</code> - The array with the found Parse objects.  
**Category**: Asynchronous.

| Param | Type | Description |
| --- | --- | --- |
| parseQuery | <code>ParseQuery</code> | The "find" Parse Query that will be executed. |
| findOptions | <code>Object</code> | Options passed to the "find" function. |

<a name="saveAllInChunks"></a>

## saveAllInChunks ⇒ <code>Array.&lt;ParseObject&gt;</code>
Execute a "saveAll" Parse Query splitting in chunks the saveAll instructions.

**Returns**: <code>Array.&lt;ParseObject&gt;</code> - An array with the saved Parse Objects
**Category**: Asynchronous.

| Param | Type | Description |
| --- | --- | --- |
| parseObjects | <code>Array.&lt;ParseObject&gt;</code> | The array of Parse object that will be saved. |
| saveOptions | <code>Object</code> | Options passed to the "saveAll" function. |
| chunkSize | <code>Number</code> | The chunk size of the promises. |

<a name="createRoleIfNotExists"></a>

## createRoleIfNotExists ⇒ <code>ParseObject</code>
Create a Role with the specified name (only if it doesn't alrady exists).

**Returns**: <code>ParseObject</code> - The created Role (undefined if the role already exists).  
**Category**: Asynchronous.

| Param | Type | Description |
| --- | --- | --- |
| roleName | <code>String</code> | The Role name. |
| saveOptions | <code>Object</code> | Options passed to the "save" command. |

<a name="isUserInRole"></a>

## isUserInRole ⇒ <code>Boolean</code>
Check if the the user is in a certain role.

**Returns**: <code>Boolean</code> - Is the user in the role?
**Category**: Asynchronous.

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>String</code> | The user objectId. |
| roleName | <code>String</code> | The role name. |

## loadClassesFromSchemas
Given an array of schemas of classes loads them in Parse Server

**Category**: Asynchronous.

| Param | Type | Description |
| --- | --- | --- |
| parseServerDb | <code>Object</code> | The Parse Server DB instance. |
| schemas | <code>Array</code> | Array of schemas.
| shouldUpdate | <code>Boolean</code> | Should the class be updated if it already exists? |

<a name="loadClassesFromSchemas"></a>
