import { NativeModules } from "react-native";

const KeyAddr = {
  wordsFromBytes: (lang, bytes) => {
    return new Promise((resolve, reject) => {
      NativeModules.KeyaddrManager.keyaddrWordsFromBytes(lang, bytes)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
    })

  },
  wordsToBytes: (lang, words) => {
    return new Promise((resolve, reject) => {
      NativeModules.KeyaddrManager.keyaddrWordsToBytes(lang, words)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
    })

  },
  wordsFromPrefix: (lang, prefix, max) => {
    return new Promise((resolve, reject) => {
      NativeModules.KeyaddrManager.keyaddrWordsFromPrefix(lang, prefix, max)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
    })

  },
  newKey: (bytes) => {
    return new Promise((resolve, reject) => {
      NativeModules.KeyaddrManager.newKey(bytes)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
    })

  },
  child: (key, childIndex) => {
    return new Promise((resolve, reject) => {
      NativeModules.KeyaddrManager.child(key, childIndex)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
    })

  },
  hardenedChild: (key, childIndex) => {
    return new Promise((resolve, reject) => {
      NativeModules.KeyaddrManager.hardenedChild(key, childIndex)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
    })

  },
  toPublic: (key) => {
    return new Promise((resolve, reject) => {
      NativeModules.KeyaddrManager.toPublic(key)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
    })

  },
  ndauAddress: (key) => {
    return new Promise((resolve, reject) => {
      NativeModules.KeyaddrManager.ndauAddress(key)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
    })

  },
  sign: (key, message) => {
    return new Promise((resolve, reject) => {
      NativeModules.KeyaddrManager.sign(key, message)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
    })

  },
  deriveFrom: (parentKey, parentPath, childPath) => {
    return new Promise((resolve, reject) => {
      NativeModules.KeyaddrManager.deriveFrom(parentKey, parentPath, childPath)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
    })

  },
  createPublicAddress: (bytes, count) => {
    return new Promise((resolve, reject) => {
      NativeModules.KeyaddrManager.CreatePublicAddress(bytes, count)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err)
        })
    })

  },
}

export {
  KeyAddr
}