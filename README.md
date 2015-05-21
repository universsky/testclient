# API Test Platform

## Supported Protocol: HTTP, HTTPS, SOTP(TCP-based),SOAP Web Service
## Supported Content Type: JSON, XML
## Supported Method: GET, POST, PUT, DELETE 

# Feature List:

1. add folder node

2. add test node
 + add Http(s) test
 + add socket test

3. copy node
 * batch copy node at the same folder
 * drag & drop node in any folder

4. update node

5. delete node
 * logic delete node
 * physical delete node

6. configure test with parameterization
![image](https://github.com/Gnail-nehc/testclient/blob/master/产品截图/配置http测试用例.png)
![image](https://github.com/Gnail-nehc/testclient/blob/master/产品截图/配置socket测试用例.png)

7. configure environment variable
 * ![image](https://github.com/Gnail-nehc/testclient/blob/master/产品截图/设置环境变量.png)


8. configure checkpoint
 * string contains checkpoint
 * regular expression checkpoint
 * sql verification checkpoint
 * javascript expression checkpoint
![image](https://github.com/Gnail-nehc/testclient/blob/master/产品截图/JS表达式验证1.png)
![image](https://github.com/Gnail-nehc/testclient/blob/master/产品截图/JS表达式验证2.png)

9. bind initial data
 * bind data from other test
![image](https://github.com/Gnail-nehc/testclient/blob/master/产品截图/配置前置数据-请求参数绑定外部接口返回.png)
 * bind data from sql returned
![image](https://github.com/Gnail-nehc/testclient/blob/master/产品截图/配置前置数据-请求参数绑定数据库字段值.png)

10. output parameter setting

11. initial action for test
 * initial other test as action
 * initial sql language as action
 * ![image](https://github.com/Gnail-nehc/testclient/blob/master/产品截图/前or后置sql动作设置.png)


12. teardown action for test
 * teardown other test as action
 * teardown sql language as action

13. execute test

14. execute batch test
![image](https://github.com/Gnail-nehc/testclient/blob/master/产品截图/批量执行测试.png)

15. view test history

16. running Env. accross folder
![image](https://github.com/Gnail-nehc/testclient/blob/master/产品截图/测试运行环境.png)

17. view charts with running metrics
 * test result summary for current week
 * test status distribution pie chart for current week
 * test passed rate trend chart for current week

18. query node with node name

19. schedule running task configuration
![image](https://github.com/Gnail-nehc/testclient/blob/master/产品截图/定时运行管理.png)

20. private/public workspace for auth user

21. special string process function for test
