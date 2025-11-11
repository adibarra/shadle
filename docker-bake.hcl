variable "REGISTRY" {
  default = "ghcr.io"
}

variable "IMAGE_NAME" {
  default = ""
}

variable "COMMIT_HASH" {
  default = "unknown"
}

target "client" {
  context = "."
  dockerfile = "Dockerfile"
  target = "client"
  args = {
    COMMIT_HASH = COMMIT_HASH
  }
}

target "server" {
  context = "."
  dockerfile = "Dockerfile"
  target = "server"
  args = {
    COMMIT_HASH = COMMIT_HASH
  }
}

group "all" {
  targets = ["client", "server"]
}
