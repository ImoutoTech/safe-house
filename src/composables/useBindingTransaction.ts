const bindingToken = shallowRef('')

export const useBindingTransaction = () => {
  const setBindingToken = (token: string) => {
    bindingToken.value = token
  }
  const consumeBindingToken = () => {
    const token = bindingToken.value
    bindingToken.value = ''
    return token
  }
  const clearBindingToken = () => {
    bindingToken.value = ''
  }

  return {
    bindingToken: readonly(bindingToken),
    setBindingToken,
    consumeBindingToken,
    clearBindingToken
  }
}
