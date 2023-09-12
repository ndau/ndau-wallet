import { Dimensions } from "react-native"
import AppConstants from "../AppConstants";
import { AlreadyHaveWalletSVGComponent, Plus } from "../assets/svgs/components";

export const isSmallerDivce = () => {
  const height = Dimensions.get('window').height;
  return height < 700;
}

const commafy = (commas, n) => {
  let ns = n.toString()
  if (commas) {
    ns = ns.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return ns
}

const roundUp = (n, carry) => {
  if (!carry) {
    return n
  }
  // if we got all the way to the end, we rounded 9 to 10 so just add the 1
  if (n === '' || n === '-') {
    return n + '1'
  }
  // get the last digit
  let last = n[n.length - 1]
  // handle decimals and commas by just rolling up one level
  if (last === '.' || last === ',') {
    return roundUp(n.slice(0, n.length - 1), true) + last
  }
  // only if it was a 9 do we have to do something special
  // this is a way to get the "next" digit; we index into
  // this string, add 1 to the index, and return the result.
  // If we had started with 9, then we have to carry.
  const digits = '01234567890'
  let newlast = digits[digits.indexOf(last) + 1]
  return roundUp(n.slice(0, n.length - 1), last === '9') + newlast
}

export const ndauUtils = {
  /**
   * This function will take a string passed in and truncate
   * it down to 19 characters if it is more than that. This
   * was created for ndau addresses as they are 48 characters
   * and tend to cause issues when displaying them in the UI.
   *
   * @param {string} address ndau address to be truncated
   * @returns {string} truncated string
   */
  truncateAddress: address => {
    if (address && address.length > 19) {
      return `${address.slice(0, 8)}...${address.slice(-8)}`
    }
    return address
  },

  /**
   * This takes a number of napu, which should be an integer, plus a
   * precision (number of decimal digits) and returns a string
   * which is the human-readable value in ndau, rounded to that
   * number of decimal digits. No floating point math is used.
   */
  formatNapuForDisplay: (napu, digits, commas) => {
    // trap for the unwary:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
    // This function is being used here to say "is digits usable as a numeric value?"
    // the default value is 3 digits.
    if (isNaN(digits)) {
      digits = 3
    }
    // fix digits if it's out of range (only 0-8 are permitted)
    if (digits < 0) {
      digits = 0
    }
    if (digits > 8) {
      digits = 8
    }

    // if the number is negative, we'll need a sign, so get that
    // out of the way first and then work in positive numbers
    let sign = ''
    if (napu < 0) {
      napu = -napu
      sign = '-'
    }

    let ndau = Math.floor(napu / AppConstants.QUANTA_PER_UNIT)
    let frac = napu % AppConstants.QUANTA_PER_UNIT

    if (digits === 0 && frac >= AppConstants.QUANTA_PER_UNIT / 2) {
      ndau = ndau + 1
    }

    // if digits === 0 then we want a rounded number of ndau,
    // so let's do that before messing with frac
    if (digits === 0) {
      return sign + commafy(commas, ndau)
    }

    // now we have sign and ndau and decimal point
    // now format the fractional value
    // turn it into an 8-digit string with leading zeros if needed.
    let fs = ('00000000' + frac.toString()).slice(-8)
    // trim it to the right length
    let fracs = fs.slice(0, digits)
    let result = sign + commafy(commas, ndau) + '.' + fracs.toString()
    // if we need all 8 digits we're done, just return it
    if (digits === 8) {
      return result
    }

    // otherwise, we need to try rounding it
    let nextdigit = fs[digits]
    return roundUp(result, nextdigit >= '5')
  },

  // This parses a string intended to be a number of ndau and converts it
  // safely to napu without using floating point. It returns the value of
  // the input string in napu. It will throw a string explaining the problem
  // if the value is unparseable.
  parseNdau: s => {
    // in order to have repeatable groupings, it's clearest to use multiple
    // regexps to support both '1.' and '.1' as valid numbers.
    const numpat1 = /^([-+]?)([0-9]+)(\.([0-9]*))?$/
    const numpat2 = /^([-+]?)([0-9]*)?(\.([0-9]+))$/
    // coerce it to a string and strip spaces and commas
    s = String(s)
      .trim()
      .replace(/,/g, '')
    let parts = numpat1.exec(s)
    if (!parts) {
      parts = numpat2.exec(s)
    }
    if (!parts) {
      // neither pattern matched
      throw Error(s + ' is not a number')
    }
    // ok, we know all the parts are valid, put it together
    let sign = parts[1]
    let whole = parts[2]
    let frac = parts[4]

    let napu = 0
    if (whole) {
      napu += parseInt(whole) * AppConstants.QUANTA_PER_UNIT
    }
    if (frac) {
      frac = (frac + '00000000').slice(0, 8)
      napu += parseInt(frac)
    }
    if (sign == '-') {
      napu = -napu
    }
    return napu
  }
}


export const addWalletsData = [
  {
    label: "I don’t have a wallet",
    title: "Create a new multi-chain wallet",
    svg: <Plus />
  },
  {
    label: "I already have a wallet",
    title: "Import a wallet",
    svg: <AlreadyHaveWalletSVGComponent />
  },
]

/**
 * Chains
 */
export const EIP155_MAINNET_CHAINS = {
  'eip155:1': {
    chainId: 1,
    name: 'Ethereum'
  },
  'eip155:137': {
    chainId: 137,
    name: 'Polygon'
  },
  'eip155:324': {
    chainId: 324,
    name: 'zkSync Era'
  }
}

export const EIP155_TEST_CHAINS = {
  'eip155:5': {
    chainId: 5,
    name: 'Ethereum Goerli'
  },
  'eip155:80001': {
    chainId: 80001,
    name: 'Polygon Mumbai'
  },
  'eip155:280': {
    chainId: 280,
    name: 'zkSync Era Testnet'
  }
}

export const EIP155_CHAINS = { ...EIP155_MAINNET_CHAINS, ...EIP155_TEST_CHAINS }