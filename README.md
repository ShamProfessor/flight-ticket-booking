# flight-ticket-booking


#### 项目结构

```
├── jsconfig.json
├── package-lock.json
├── package.json
├── README.md
└── src
    ├── app.js      项目入口
    ├── constant    静态常量
    ├── entity      实体 ( FlightPrice , FlightInformation)
    ├── enum        枚举
    ├── service     服务 ( 用于存储查找 FlightPrice , FlightInformation )
    ├── util        工具
    └── __test__    测试
```

#### 安装依赖

进入项目根目录，安装用于测试的 unit test library （`jest @types/jest` )

```bash
npm i
```


#### 运行测试（请在 Node.js 环境下）

进入项目根目录，并运行

```
npm run test
```

#### 查看  input and output

请进入 `src\__test__\app.test.js`测试文件，查看  input and output 。# flight-ticket-booking
