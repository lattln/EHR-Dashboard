export const TypeCheck = {
    isString: function(value){
        return typeof value === "string";
    },

    isNumber: function(value){
        return (typeof value === "bigint" || typeof value === "number");
    },

    isPrimitive: function(value){
        return this.isString(value) || this.isNumber(value) || this.isBoolean(value)
            || this.isNull(value) || this.isUndefined(value);
    },

    isNull: function(value){
        return value === null;
    },

    isUndefined: function(value){
        return typeof value === "undefined";
    },

    isBoolean: function(value){
        return typeof value === "boolean";
    },

    isDateObject: function(value){
        return this.isObject(value) && value instanceof Date;
    },

    isArrayOfNumbers: function(value) {
        const isArray = Array.isArray(value);
        let isNumber = false;
        for(const number of value) {
            if (typeof number === "number"){
                isNumber = true;
            } else {
                isNumber = false;
                break;
            }
        }

        return isArray && isNumber;
    },

    isArrayOfStrings: function(value) {
        const isArray = Array.isArray(value);
        let isString = false;
        for(const str of value) {
            if (typeof str === "string"){
                isString = true;
            } else {
                isString = false;
                break;
            }
        }

        return isArray && isString;
    },

    isArrayOfObjects: function(value){
        let isArray = Array.isArray(value);
        let isObject = false;

        for (const element of value) {
            if(!this.isObject(element)){
                isObject = false;
                break;
            } else{
                isObject = true;
            }
        
        }

        return isArray && isObject;
    },

    isArray: function(value) {
        return Array.isArray(value);
    },

    isEmptyArray: function(value){
        return Array.isArray(value) && value.length === 0
    },

    isObject: function(value) {
        return !Array.isArray(value) && typeof value === "object" ? true : false;
    },

    isEmptyObject: function(value) {
        return this.isObject(value) && Object.keys(value).length === 0;
    },

    objectHasKeys: function (listOfKeys, obj) {
        if (!this.isArrayOfStrings(listOfKeys)){
            throw new Error(`Invalid argument: listOfKeys: ${listOfKeys} must be an array of strings`);
        }

        if(!this.isObject(obj)){
            throw new Error(`Invalid argument: obj: ${JSON.stringify(obj, null, 4)} must be an object`)
        }

        const listOfObjectKeys = Object.keys(obj);

        for (const key of listOfKeys){
            if(!listOfObjectKeys.includes(key)){
                return false;
            }
        }

        return true;
    }

};