export function isJSON(value: any): boolean {
  try {
    JSON.parse(value)
  } catch (error) {
    return false
  }
  return true
}
