# Uright - 区块链音乐版权管理ÐApp

### 简介

基于Angular+Solidity+Web3.js，应用IPFS、ENS、Oracles等技术，通过Truffle部署于Ethereum的音乐版权管理Decentralized Application (ÐApp)。

Uright去中心化应用允许音乐人（内容所有者）将他们的作品注册为"Manifestations"并登记至以太坊区块链。

"Manifestations"将音乐人的作品展现为内容片段，用以证明作者身份及所有权。这是通过"Manifestations"智能合约完成的，该智能合约记录显示作品内容的IPFS哈希、标题(计划附加元数据)以及注册时间，这些信息可以用来证明作者身份，并且内容可以从IPFS文件存储系统中检索到。

然而，仅仅注册一个"Manifestations"是不够的，还应提供支撑材料，否则该"Manifestations"将于一天后失效。这些支持材料通常由音乐人（作品上传者）注册，但任何其他人都可以添加支撑材料，支撑材料可以是任何类型的文件，如截图、PDF文档等。"UploadEvidences"智能合约会将支撑材料上传至IPFS文件系统。

此外，"YouTubeEvidences"智能合约允许音乐人在YouTube等视频/音乐平台的上传简介中声明作品"Manifestations"，智能合约将自动检测作为支撑材料。

（开发中...）如果有其他人已经注册了音乐人的原创作品/支持材料，音乐人可以进行申诉，合约功能已实现，但在Web应用尚不可用。

（开发中...）通过NFT技术对音乐人作品进行代币化。

项目地址：[GitHub](https://github.com/pseudoyu/Uright)

### 功能

Uright ÐApp通过Web客户端对音乐人和用户提供音乐版权管理服务

1. 版权注册：以作品文件生成唯一哈希值，将音乐人的作品注册上链，以此证明作品版权

- 注册从未注册的新作品
- 注册已存在注册记录的作品并进行申诉
- 添加支撑材料来证明作品版权

2. 版权检索：通过哈希值检查一个作品是否已被注册

- 我的：查找当前音乐人的所有注册作品
- 版权库：查找链上所有已注册作品
- 详细信息：单击“详细信息”查看详细信息，包括所有已上传证据

### 核心技术

#### IPFS

当音乐人使用数字文件（如.mp3格式文件）注册自己的作品时，文件将被上传至IPFS且其生成的IPFS标识符(哈希值)用于在Ethereum区块链中注册作品。用户可以选择将作品上传至IPFS网络，也可以保持作品的私密性，设置将内容不上传至IPFS网络，而只生成作品哈希值。

用户需要保留与生成作品哈希时使用的完全相同的文件，可在以后用作拥有数字文件的证据，以便于哈希检验。IPFS哈希值也将用于检索上传的内容。

#### Ethereum Naming System (ENS)

Uright项目集成了ethereum-ens包，可作用于以太坊主网、Ropsten、Rinkeby测试网及本地测试网。ensdomains/ens包用于设置地址名称。

#### Oracles

Oracle模块集成在上传YouTube证据的智能合约，通过YouTube的视频ID (https://www.youtube.com/watch?v=VIDEO_ID) 来检索该视频描述中是否含有特定作品哈希。

因此，该功能允许音乐人证明该作品同时存在于YouTube平台并属于自己（因为仅上传者可以编辑视频描述，使其包含作品哈希值）

可使用Oraclize提供的在线服务进行查询: http://app.oraclize.it/home/test_query

#### 可升级性

为了使作品注册合约具备可升级性，引入ZeppelinOS中的AdminUpgradeabilityProxy，通过中继代理的方式实现了委任模式。

### 智能合约详解

#### Manifestations.sol

此智能合约用于注册作品，通过将作品元数据（目前为标题）及内容的IPFS 哈希值与作者身份（即以太坊账户地址）进行关联，以证明作品所有权，同一作品可声明为单人作者或联合作者。此外，如用一个已经注册的内容哈希重新注册新作品，系统会检测为失败。

#### UploadEvidences.sol

此智能合约主要用于支持材料登记，通过将作品文件内容上传至IPFS文件系统进行证据登记。对于同一个作品，可以添加多个证据（但不能重复添加）。

#### ExpirableLib.sol

此智能合约主要用于管理作品创建和到期时间的项目逻辑，实现作品注册（或申诉）的时效性。

### 设计模式

Uright项目智能合约的设计有利于模块化和可重用性。比如，将验证过期功能实现为一个实体库；以及"Evidencable"库使注册作品可累积多项支持材料，也可以在后续申诉功能等研发中提供便利。

此外，将这些功能作为库提供可以降低部署成本。

#### Circuit Breaker (断路器模式) / Emergency Stop

断路器的模式可以防止一个应用程序反复尝试执行一个可能会失败的操作，让它继续不等待故障的纠正或浪费处理器周期，而它决定了故障是长期持久的。断路器的模式也使一个应用程序来检测故障是否已得到解决。如果出现问题，该应用程序可以尝试调用操作。

#### Automatic Deprecation

此外，对已登记的作品实行了类似于"Automatic Deprecation"的模式。这样，如果一个
用户注册了作品但不提供支持材料，其注册将在设定的固定时间后过期，在这种情况下，过期意味着该作品可以被另一个用户重新注册覆盖。

### 安全措施

所有智能合约都已使用Remix和Solhint工具进行了代码检查，通过这两种工具检查常见的安全问题，如可重入性或时间戳依赖性等。

SafeMath库用于避免整数上溢和下溢问题。

最后，Solhint被设置为定义的连续集成和部署工作流中的一个步骤，这样，每次代码被推送到GitHub时，travis都会运行所有的测试(对于合同和Angular前端)，如果所有测试都通过，则负责部署。

此外，Solhint工具也会在测试之前执行，用于跟踪任何可能出现的安全问题。

### 相关库

Uright项目从ZeppelinOS和OpenZeppelin包中导入了一些库用于功能实现

#### ZeppelinOS

- AdminUpgradeabilityProxy: 实现智能合约的可升级性
- Initializable: 通过可升级的智能合约拓展实现代理的初始化

#### OpenZeppelin

- Pausable: 实现"Circuit Breaker (断路器模式) / Emergency Stop"设计模式，通过拓展Ownable以实现只有拥有者可以停止
- SafeMath: 用于避免整数上溢和下溢问题
- OraclizeAPI包，usingOraclize，用于检验YouTube视频是否属于特定用户且绑定至版权作品