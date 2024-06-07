import { PowerAuth as PowerAuthClass } from "./power-auth"

const createInstance = (): PowerAuthClass => {
  return new PowerAuthClass()
}

const PowerAuth = createInstance()

export default PowerAuth
