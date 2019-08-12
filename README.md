# computer
介绍本软件用于查看主机的CPU、内存等使用情况，每5分钟统计一次，数据有效时长1天。
详细地址：ip:port/html/index.html
界面展示：


安装步骤：
1.安装JDK
	简单，百度。
2.安装influxdb，并启动服务
	简单，百度。
3.建表
	CREATE DATABASE cd_supply_demand
4.启动jar
	nohup java -jar computer-0.0.1-SNAPSHOT.jar -start & echo &!
	nohup java -jar computer-0.0.1-SNAPSHOT.jar --spring.config.location=./application.yml -start & echo &!


注意事项：
	需要配置sigar文件,文件在src/main/lib目录下，详情可见 https://blog.csdn.net/yin_jw/article/details/40151547 文章
	window系统		将下载好的sigar-amd64-winnt.dll拷贝到%JAVA_HOME%\bin目录下（jdk的安装路径下的bin目录）
	Centos(linux)	将下载好的libsigar-amd64-linux.so 拷贝到/usr/lib64/下面 
	可解决no libsigar-amd64-linux.so in java.library.path这类问题
	
	
File								Language				Description							Required

sigar.jar							Java					Java API							Yes	
log4j.jar							Java					Java logging API					No
libsigar-x86-linux.so				C						Linux AMD/Intel 32-bit				*
libsigar-amd64-linux.so				C						Linux AMD/Intel 64-bit				*
libsigar-ppc-linux.so				C						Linux PowerPC 32-bit				*
libsigar-ppc64-linux.so				C						Linux PowerPC 64-bit				*
libsigar-ia64-linux.so				C						Linux Itanium 64-bit				*
libsigar-s390x-linux.so				C						Linux zSeries 64-bit				*
sigar-x86-winnt.dll					C						Windows AMD/Intel 32-bit			*
sigar-amd64-winnt.dll				C						Windows AMD/Intel 64-bit			*
libsigar-ppc-aix-5.so				C						AIX PowerPC 32-bit					*
libsigar-ppc64-aix-5.so				C						AIX PowerPC 64-bit					*
libsigar-pa-hpux-11.sl				C						HP-UX PA-RISC 32-bit				*
libsigar-ia64-hpux-11.sl			C						HP-UX Itanium 64-bt					*
libsigar-sparc-solaris.so			C						Solaris Sparc 32-bit				*
libsigar-sparc64-solaris.so			C						Solaris Sparc 64-bit				*
libsigar-x86-solaris.so				C						Solaris AMD/Intel 32-bit			*
libsigar-amd64-solaris.so			C						Solaris AMD/Intel 64-bit			*
libsigar-universal-macosx.dylib		C						Mac OS X PowerPC/Intel 32-bit		*
libsigar-universal64-macosx.dylib	C						Mac OS X PowerPC/Intel 64-bit		*
libsigar-x86-freebsd-5.so			C						FreeBSD 5.x AMD/Intel 32-bit		*
libsigar-x86-freebsd-6.so			C						FreeBSD 6.x AMD/Intel 64-bit		*
libsigar-amd64-freebsd-6.so			C						FreeBSD 6.x AMD/Intel 64-bit		*

