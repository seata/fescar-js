# seata-js

Js Implementation For Seata

# TODO

### seata-serializer

- [ ] serializer-fst
- [ ] serializer-kryo
- [ ] serializer-protobuf
- [ ] serializer-seta
- [x] serializer-hessian 100%

### seata-compressor

- [ ] compressor-bzip2
- [ ] compressor-deflater
- [ ] compressor-gzip
- [ ] compressor-lz4
- [x] compressor-none 100%
- [ ] compressor-sevenz
- [ ] compressor-zip
- [ ] compressor-zstd

### seata-rpc-client

- [x] protocol-v1 100%
- [ ] tcp-transport 60%
- [ ] seata-cluster
- [x] seata-queue 100%
- [ ] seata-scheduler

### seata-registry

- [ ] zookeeper
- [ ] nacos

### seata-rm

- [ ] rm-client 10%
- [ ] registryResouce
- [ ] unregistryResource
- [ ] getManagedResources
- [ ] getBranchType
- [ ] branchCommit
- [ ] branchRollBack
- [ ] branchRegister
- [ ] branchReport
- [ ] lockQuery

### seata-tm

- [ ] tm-client
- [ ] begin
- [ ] commit
- [ ] rollback
- [ ] getStatus
- [ ] globalReport
