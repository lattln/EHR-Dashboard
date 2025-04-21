import {TypeCheck} from "./typechecking.js";

export function validate(validation_schema = {}) {
    if (TypeCheck.isUndefined(validation_schema) || TypeCheck.isEmptyObject(validation_schema) || !TypeCheck.isObject(validation_schema)) 
        throw new Error("Invalid Schema");
    
    
    for (let [key, entry] of Object.entries(validation_schema)) {
        let {type, value} = entry

        if (!type || TypeCheck.isUndefined(value)){
            throw new Error("Invalid Schema");
        }
        
        
        if (type === "array" && !TypeCheck.isArray(value)){
           throw new Error(`Invalid Type: Expecting variable ${key} to be of type ${type} but was ${typeof value}`); 
        }
        
        if (type === "object" && !TypeCheck.isObject(value)){
            throw new Error(`Invalid Type: Expecting variable ${key} to be of type ${type} but was ${typeof value}`);
        }
        
        //nested objects
        if (type === "object" && TypeCheck.isObject(value)){
            
            try {
                validate(value)
            } catch (err) {
                throw err;
            }
        }
        else if(type === "array" && TypeCheck.isArray(value)) {
            try {
                let index = 0;
                for (let item of value) {
                    validate({ [`${key}[${index}]`]: item });
                    index++;
                }
            } 
            catch (err) {
                throw err;
            }
        }
        else if (typeof value !== type) {
            throw new Error(`Invalid Type: Expecting variable ${key} to be of type ${type} but was ${typeof value}`);
        }
    }
    
    return true;
}

export function SchemaBuilder(){
    let schema = {};

    return {
        addParam: function(key, type, options={}){
            schema[key] = {
                type: type,
                nestedSchema: options.nestedSchema || undefined,
                itemType: options.itemType || undefined,
                ignoreValidation: options.ignoreValidation || false,
                required: options.required || true,
            }
            return this;
        },
        build: function(argObject = {}){
            const builtSchema = {};

            for (const [key, paramSchema] of Object.entries(schema)){
                const { type, nestedSchema, required, itemType, ignoreValidation} = paramSchema;

                const value = argObject[key] !== undefined ? argObject[key] : undefined;

                if(value === undefined && required){
                    throw new Error(`Missing Required Argument: ${key}`)
                }

                if (type === "object" && nestedSchema && value !== undefined) {
                    builtSchema[key] = {
                        type: "object",
                        value: nestedSchema.build(value)
                    };
                } else if (type === "array" && value !== undefined) {
                    if (nestedSchema) {
                        builtSchema[key] = {
                            type,
                            value: value.map(item => ({
                                type: "object",
                                value: nestedSchema.build(item)
                            }))
                        };
                    } else if (itemType) {
                        builtSchema[key] = {
                            type,
                            value: value.map(item => ({
                                type: itemType,
                                value: item
                            }))
                        };
                    } else {
                        throw new Error(`Invalid Schema: Missing itemType or nestedSchema for array ${key}`);
                    }

                } else {
                    builtSchema[key] = {type, value};
                }
            }
            return builtSchema;
        }
    }
}