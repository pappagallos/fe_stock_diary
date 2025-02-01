/**
 * 구글의 이메일 가이드라인
 * https://support.google.com/a/answer/9193374?hl=ko
 *
 * 구글의 도메인 요구사항
 * https://cloud.google.com/endpoints/docs/openapi/verify-domain-name?hl=ko
 */
export function isValidEmail(email: string) {
  // 범용적으로 사용할 수 있는 이메일 검증 정규식

  // ([a-z0-9\-\_\'\.]{1,64})
  // 1. 사용자 이름에 문자(a-z), 숫자(0-9), 대시(-), 밑줄(_), 아포스트로피('), 마침표(.)를 포함할 수 있습니다.
  // 2. 사용자 이름의 문자는 소문자여야 합니다. 사용자 이름을 만들 때 대문자를 입력하면 소문자로 변경됩니다.
  // 3. 사용자 이름의 처음과 끝에 마침표(.)를 제외한 영숫자가 아닌 문자를 사용할 수 있으며 최대 64자(영문 기준)까지 입력할 수 있습니다.

  // @(?=[a-z].{1,252}$)(?!.*\.$)([a-z0-9\-]+\.[a-z\.]{2,})
  // 1. 도메인 이름 최대 길이는 253자(영문)입니다.
  // 2. 도메인 이름은 소문자로 시작해야 합니다.
  const regex =
    /([a-z0-9\-\_\'\.]{1,64})@(?=[a-z].{1,252}$)(?!.*\.$)([a-z0-9\-]+\.[a-z\.]{2,})/;
  const isValid = regex.test(email);

  // 이메일 형식 검증
  if (!isValid) return false;

  const reservedWords = [
    "abuse",
    "admin",
    "administrator",
    "hostmaster",
    "majordomo",
    "postmaster",
    "root",
    "ssl-admin",
    "webmaster",
  ];
  const [, userName, domain] = email.match(regex) ?? [];

  // 이메일 형식 검증
  if (userName.startsWith(".") || userName.endsWith(".")) return false;

  // 예약어 포함 여부
  if (reservedWords.includes(domain)) return false;

  return true;
}

/**
 * 두 문자열이 같은지 여부
 * @param a 문자열
 * @param b 문자열
 * @returns 같으면 true, 다르면 false
 */
export function isEqual(a: string, b: string) {
  return a === b;
}

/**
 * 문자열이 비어있는지 여부
 * @param value 문자열
 * @returns 비어있으면 true, 아니면 false
 */
export function isEmpty(value: string) {
  return value === "";
}

/**
 * 날짜 형식 검증
 * @param date 날짜
 * @returns 날짜 형식이 맞으면 true, 아니면 false
 */
export function isValidDate(date: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
}
