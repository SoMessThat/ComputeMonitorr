# 主机监控信息<br>
版本：**V 1.0.0**  <br>
介绍：用于查看主机的CPU、内存等使用情况，每5分钟统计一次，数据有效时长1天。<br>
安装包位置:主目录/target/<br>
###详细地址：<br>
{ip}:{port}/html/index.html<br>
&nbsp;&nbsp;[事例请点击这里](http://www.bemess.xyz:12345/html/index.html)<br>
###界面展示：<br>
![首页](http://www.bemess.xyz:8765/7105_017774.png)  <br> 
![详细信息](http://www.bemess.xyz:8765/dfa7_024134.png) <br> 
###安装步骤：
##### 1.安装JDK<br> 
自行百度。<br> 
##### 2.安装influxdb，并启动服务<br> 
自行百度。<br> 
##### 3.建库<br> 

	CREATE DATABASE cd_supply_demand 
#####4.启动jar<br>

	
	nohup java -jar computer-0.0.1-SNAPSHOT.jar -start & echo &!
	
或

	nohup java -jar computer-0.0.1-SNAPSHOT.jar --spring.config.location=./application.yml -start & echo &! 



## 注意事项：

需要配置sigar文件,文件在src/main/lib目录下，详情可见&nbsp;[Sigar介绍和配置](https://blog.csdn.net/yin_jw/article/details/40151547)。<br> 
window系统&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; 将下载好的&nbsp; `sigar-amd64-winnt.dll`&nbsp; 拷贝到&nbsp; `%JAVA_HOME%\bin`&nbsp; 目录下（jdk的安装路径下的bin目录）。<br> 
Centos(linux)&nbsp;&nbsp; &nbsp; &nbsp; 将下载好的&nbsp; `libsigar-amd64-linux.so` &nbsp; 拷贝到&nbsp; `/usr/lib64/`&nbsp; 下面 。<br> 
可解决&nbsp;&nbsp; &nbsp; &nbsp; <font color="red">no libsigar-amd64-linux.so in java.library.path</font>&nbsp; &nbsp; &nbsp; &nbsp; 这类问题。<br> 
	
	
####配置文件与系统对应信息<br> 
![配置文件与系统对应信息](http://www.bemess.xyz:8765/3ec7_957904.png)

