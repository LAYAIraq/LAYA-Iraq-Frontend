/**
 * @file handle arabic strings
 * @author cmc
 * @since v1.3.0
 */

/**
 * @description take arabic string, transcribe to chat alphabet
 * @author cmc
 * @param text arabic string
 * @returns string transformed to arabic chat alphabet
 */
export const arabicToChat = (text: string): string => {
  // transform arabic letters to latin letters
  text = text.replace(/[\u0600-\u06FF]/g, (letter) => {
    return arabicToLatin[letter]
  })
  // replace 'aa' with hyphen
  text = text.replace(/aa/g, '-')
  // remove any double vowels
  text = text.replace(/([aeiou])\1+/g, '$1')
  return text
}

// lookup table for mapping arabic to latin letters
const arabicToLatin = {
  ء: '2',
  آ: '2',
  أ: '2',
  ؤ: '2',
  إ: '2',
  ئ: '2',
  ا: 'A',
  ب: 'B',
  ة: 'H',
  ت: 'T',
  ث: 'th',
  ج: 'j',
  ح: '7',
  خ: 'kh',
  د: 'D',
  ذ: 'DH',
  ر: 'R',
  ز: 'Z',
  س: 'S',
  ش: 'SH',
  ص: '9',
  ض: 'DH',
  ط: '6',
  ظ: 'TH',
  ع: '3',
  غ: '8',
  ف: 'F',
  ق: 'Q',
  ك: 'K',
  ل: 'L',
  م: 'M',
  ن: 'N',
  ه: 'H',
  و: 'W',
  ى: 'A',
  ي: 'I',
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9'
}
