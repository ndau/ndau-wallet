// Objective-C API for talking to github.com/ndau/ndaumath/pkg/keyaddr Go package.
//   gobind -lang=objc github.com/ndau/ndaumath/pkg/keyaddr
//
// File is generated by gobind. Do not edit.

#ifndef __Keyaddr_H__
#define __Keyaddr_H__

@import Foundation;
#include "ref.h"
#include "Universe.objc.h"


@class KeyaddrAddress;
@class KeyaddrKey;
@class KeyaddrSignature;

/**
 * Address is an Ndau Address, derived from a public key.
 */
@interface KeyaddrAddress : NSObject <goSeqRefInterface> {
}
@property(strong, readonly) _Nonnull id _ref;

- (nonnull instancetype)initWithRef:(_Nonnull id)ref;
- (nonnull instancetype)init;
@property (nonatomic) NSString* _Nonnull address;
@end

/**
 * Key is the object that contains a public or private key
 */
@interface KeyaddrKey : NSObject <goSeqRefInterface> {
}
@property(strong, readonly) _Nonnull id _ref;

- (nonnull instancetype)initWithRef:(_Nonnull id)ref;
/**
 * NewKey takes a seed (an array of bytes encoded as a base64 string) and creates a private master
key from it. The key is returned as a string representation of the key;
it is converted to and from the internal representation by its member functions.
 */
- (nullable instancetype)init:(NSString* _Nullable)seedstr;
@property (nonatomic) NSString* _Nonnull key;
/**
 * Child returns the n'th child of the given extended key. The child is of the
same type (public or private) as the parent. Although n is typed as a signed
integer, this is due to the limitations of gomobile; n may not be negative.
It is an error if the given key is a hardened key.
 */
- (KeyaddrKey* _Nullable)child:(int32_t)n error:(NSError* _Nullable* _Nullable)error;
/**
 * HardenedChild returns the n'th hardened child of the given extended key.
The parent key must be a private key.
A HardenedChild is guaranteed to have been derived from a private key.
Although n is typed as a signed integer, this is due to the limitations of gomobile;
n may not be negative.
It is an error if the given key is already a hardened key.
 */
- (KeyaddrKey* _Nullable)hardenedChild:(int32_t)n error:(NSError* _Nullable* _Nullable)error;
/**
 * IsPrivate tests if a given key is a private key; will return non-nil
error if the key is invalid.
 */
- (BOOL)isPrivate:(BOOL* _Nullable)ret0_ error:(NSError* _Nullable* _Nullable)error;
/**
 * NdauAddress returns the ndau address associated with the given key.
Key can be either public or private; if it is private it will be
converted to a public key first.
 */
- (KeyaddrAddress* _Nullable)ndauAddress:(NSError* _Nullable* _Nullable)error;
/**
 * SignEdB64 uses the given ED key to sign a message; the message must be the
standard base64 encoding of the bytes of the message.
It returns a signature object.
The key must be a private key.
 */
- (KeyaddrSignature* _Nullable)signEdB64:(NSString* _Nullable)msgstr error:(NSError* _Nullable* _Nullable)error;
/**
 * SignEdText uses the given ED key to sign a message; the message must be the
text encoding of the bytes of the message.
It returns a signature object.
The key must be a private key.
 */
- (KeyaddrSignature* _Nullable)signEdText:(NSString* _Nullable)msgstr error:(NSError* _Nullable* _Nullable)error;
/**
 * SignSecP uses the given SecP key to sign a message; the message must be the
standard base64 encoding of the bytes of the message.
It returns a signature object.
The key must be a private key.
 */
- (KeyaddrSignature* _Nullable)signSecP:(NSString* _Nullable)msgstr error:(NSError* _Nullable* _Nullable)error;
// skipped method Key.ToExtended with unsupported parameter or return types

// skipped method Key.ToPrivateKey with unsupported parameter or return types

/**
 * ToPublic returns an extended public key from any other extended key.
If the key is an extended private key, it generates the matching public key.
If the key is already a public key, it just returns itself.
It is an error if the key is hardened.
 */
- (KeyaddrKey* _Nullable)toPublic:(NSError* _Nullable* _Nullable)error;
// skipped method Key.ToPublicKey with unsupported parameter or return types

// skipped method Key.UnivToPrivateKey with unsupported parameter or return types

@end

/**
 * Signature is the result of signing a block of data with a key.
 */
@interface KeyaddrSignature : NSObject <goSeqRefInterface> {
}
@property(strong, readonly) _Nonnull id _ref;

- (nonnull instancetype)initWithRef:(_Nonnull id)ref;
- (nonnull instancetype)init;
@property (nonatomic) NSString* _Nonnull signature;
// skipped method Signature.ToSignature with unsupported parameter or return types

@end

/**
 * DeriveFrom accepts a parent key and its known path, plus a desired child path
and derives the child key from the parent according to the path info.
Note that the parent's known path is simply believed -- we have no mechanism to
check that it's true.
 */
FOUNDATION_EXPORT KeyaddrKey* _Nullable KeyaddrDeriveFrom(NSString* _Nullable parentKey, NSString* _Nullable parentPath, NSString* _Nullable childPath, NSError* _Nullable* _Nullable error);

/**
 * FromOldString is FromString, but it operates on the old key serialization format.

The returned object will be serialized in the new format, so future calls
to FromString will succeed.
 */
FOUNDATION_EXPORT KeyaddrKey* _Nullable KeyaddrFromOldString(NSString* _Nullable s, NSError* _Nullable* _Nullable error);

/**
 * FromString acts like a constructor so that the wallet can build a Key object
from a string representation of it.
 */
FOUNDATION_EXPORT KeyaddrKey* _Nullable KeyaddrFromString(NSString* _Nullable s, NSError* _Nullable* _Nullable error);

// skipped function KeyFromExtended with unsupported parameter or return types


// skipped function KeyFromPrivate with unsupported parameter or return types


// skipped function KeyFromPublic with unsupported parameter or return types


/**
 * NewKey takes a seed (an array of bytes encoded as a base64 string) and creates a private master
key from it. The key is returned as a string representation of the key;
it is converted to and from the internal representation by its member functions.
 */
FOUNDATION_EXPORT KeyaddrKey* _Nullable KeyaddrNewKey(NSString* _Nullable seedstr, NSError* _Nullable* _Nullable error);

// skipped function SignatureFrom with unsupported parameter or return types


/**
 * WordsFromBytes takes an array of bytes and converts it to a space-separated list of
words that act as a mnemonic. A 16-byte input array will generate a list of 12 words.
 */
FOUNDATION_EXPORT NSString* _Nonnull KeyaddrWordsFromBytes(NSString* _Nullable lang, NSString* _Nullable data, NSError* _Nullable* _Nullable error);

/**
 * WordsFromPrefix accepts a language and a prefix string and returns a sorted, space-separated list
of words that match the given prefix. max can be used to limit the size of the returned list
(if max is 0 then all matches are returned, which could be up to 2K if the prefix is empty).
 */
FOUNDATION_EXPORT NSString* _Nonnull KeyaddrWordsFromPrefix(NSString* _Nullable lang, NSString* _Nullable prefix, long max);

/**
 * WordsToBytes takes a space-separated list of words and generates the set of bytes
from which it was generated (or an error). The bytes are encoded as a base64 string
using standard base64 encoding, as defined in RFC 4648.
 */
FOUNDATION_EXPORT NSString* _Nonnull KeyaddrWordsToBytes(NSString* _Nullable lang, NSString* _Nullable w, NSError* _Nullable* _Nullable error);

#endif
