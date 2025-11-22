variable "REGISTRY" {
  default = "ghcr.io"
}

variable "IMAGE_NAME" {
  default = ""
}

variable "COMMIT_HASH" {
  default = "unknown"
}

target "app" {
  context = "."
  dockerfile = "Dockerfile"
  target = "app"
  args = {
    COMMIT_HASH = COMMIT_HASH
  }
}

group "all" {
  targets = ["app"]
}
