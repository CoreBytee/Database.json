import FS from "fs"

function ReadJson(Path) {
    return JSON.parse(FS.readFileSync(Path, "utf-8"))
}

function WriteJson(Path, Data) {
    return FS.writeFileSync(Path, JSON.stringify(Data, null, 4))
}

class DataBase {

    constructor(Path) {
        this.Path = Path
        if (!FS.existsSync(Path)) {
            FS.writeFileSync(Path, "{}")
        }
        this.Data = ReadJson(Path)
    }

    GetKey(Key, Default) {
        const KeyParts = Key.split(".")
        let Data = this.Data
        for (const KeyPart of KeyParts) {
            if (Data[KeyPart] === undefined) {
                return Default
            }
            Data = Data[KeyPart]
        }
        return Data
    }

    SetKey(Key, Value) {
        const KeyParts = Key.split(".")
        let Data = this.Data
        let Index = 0
        for (const KeyPart of KeyParts) {
            if (Index === KeyParts.length - 1) {
                if (Value === undefined) {
                    delete Data[KeyPart]
                } else {
                    Data[KeyPart] = Value    
                }
                break
            }
            if (Data[KeyPart] === undefined) {
                Data[KeyPart] = {}
            }
            Data = Data[KeyPart]
            Index++
        }
        WriteJson(this.Path, this.Data)
    }

    SetKeyIfNotExists(Key, Value) {
        if (this.GetKey(Key, null) === null) {
            this.SetKey(Key, Value)
        }
    }

    RemoveKey(Key) {
        this.SetKey(Key, undefined)
    }
}

export default DataBase