package mess.computer;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.hyperic.sigar.CpuPerc;
import org.hyperic.sigar.FileSystem;
import org.hyperic.sigar.FileSystemUsage;
import org.hyperic.sigar.Mem;
import org.hyperic.sigar.OperatingSystem;
import org.hyperic.sigar.Sigar;
import org.hyperic.sigar.SigarException;
import org.hyperic.sigar.Swap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * @description: 监控主机状态工具类	(定时插入influxDB数据库)
 * @createTime: 2019年7月18日下午4:45:03
 * @author：wu.kaibin
 * @version：1.0
 */
@Component
public class ComputerStatusScheduled {

	@Autowired
	InfluxDBConnectionUtil influxDB;
	public static Map<String, String> tags = new HashMap<String, String>();
	public static Map<String, Object> fields = new HashMap<String, Object>();
	public static String measurement = "ttttttt";
	public static DecimalFormat df = new DecimalFormat("#.00");
	@Async
	@Scheduled(cron = "0 0/5 * * * ?")
//	@Scheduled(cron = "0/5 * * * * ? ")
	public void run() {
//		System.err.println("执行静态定时任务时间: " + new Date());
		try {
			//System信息，从jvm获取
			property();
		} catch (UnknownHostException e3) {

		}
		try {
			//cpu信息
			cpu();
		} catch (SigarException e2) {

		}
		try {
			//内存信息
			memory();
		} catch (SigarException e1) {

		}
		//操作系统信息
		os();
		try {
			//文件系统信息
			file();
		} catch (Exception e) {

		}
		influxDB.influxDbBuild();
		influxDB.createDefaultRetentionPolicy();
//		System.out.println(tags);
//		System.out.println(fields);
		influxDB.insert(measurement, tags, fields, 0, null);
	}

	private static void property() throws UnknownHostException {
		Runtime r = Runtime.getRuntime();
		Properties props = System.getProperties();
		InetAddress addr = InetAddress.getLocalHost();
		Map<String, String> map = System.getenv();
		//用户名:    
//		tags.put("userName" , map.get("USERNAME"));
		//计算机名:    
//		tags.put("computerName" , map.get("COMPUTERNAME"));
		//计算机域名:    
//		tags.put("computerDomain" , map.get("USERDOMAIN"));
		//本地ip地址:    
		tags.put("computerIp" , addr.getHostAddress());
		//本地主机名:    
		tags.put("hostName" , addr.getHostName());
		//JVM可以使用的处理器个数:    
		fields.put("availableProcessors" , r.availableProcessors());
		//Java的运行环境版本：    
		fields.put("javaVersion" , props.getProperty("java.version"));
		//操作系统的名称：    
		fields.put("osName" , props.getProperty("os.name"));

//		JVM可以使用的总内存:    
		fields.put("totalMemory" , r.totalMemory() *1.0 / 1024L / 1024L);
//		JVM可以使用的剩余内存:    
		fields.put("freeMemory" , r.freeMemory() *1.0 / 1024L / 1024L);
//		Java的运行环境供应商：   
		fields.put("javaVendor" , props.getProperty("java.vendor"));
//		Java供应商的URL：   
//		fields.put("javaVendorUrl" , props.getProperty("java.vendor.url"));
//		Java的安装路径：  
//		fields.put("javaHome" , props.getProperty("java.home"));
//		Java的虚拟机规范版本：   
//		fields.put("javaVmSpecificationVersion" , props.getProperty("java.Vm.specification.Version"));
//		Java的虚拟机规范供应商：    
//		fields.put("javaVmSpecificationVendor" , props.getProperty("java.vm.specification.vendor"));
//		Java的虚拟机规范名称：   
//		fields.put("javaVmSpecificationName" , props.getProperty("java.vm.specification.name"));
//		Java的虚拟机实现版本：    
//		fields.put("javaVmVersion" , props.getProperty("java.vm.version"));
//		Java的虚拟机实现供应商：    
//		fields.put("javaVmVendor" , props.getProperty("java.vm.vendor"));
//		Java的虚拟机实现名称：    
//		fields.put("javaVmName" , props.getProperty("java.vm.name"));
//		Java运行时环境规范版本：    
//		fields.put("javaSpecificationVersion" , props.getProperty("java.specification.version"));
//		Java运行时环境规范供应商：   
//		fields.put("javaSpecificationVender" , props.getProperty("java.specification.vender"));
//		Java运行时环境规范名称：    
//		fields.put("javaSpecificationName" , props.getProperty("java.specification.name"));
//		Java的类格式版本号：   
//		fields.put("javaClassVersion" , props.getProperty("java.classVersion"));
//		Java的类路径：    
//		fields.put("javaClassPath" , props.getProperty("java.class.path"));
//		加载库时搜索的路径列表：    
//		fields.put("javaLibraryPath" , props.getProperty("java.library.path"));
//		默认的临时文件路径：    
//		fields.put("javaIoTmpdir" , props.getProperty("java.io.tmpdir"));
//		一个或多个扩展目录的路径：  
//		fields.put("javaExtDirs" , props.getProperty("java.ext.dirs"));
//		操作系统的构架：    
//		fields.put("osArch" , props.getProperty("os.arch"));
//		操作系统的版本：    
//		fields.put("osVersion" , props.getProperty("os.version"));
//		文件分隔符：    
//		fields.put("fileSeparator" , props.getProperty("file.separator"));
//		径分隔符：    
//		fields.put("pathSeparator" , props.getProperty("path.separator"));
//		行分隔符：    
//		fields.put("lineSeparator" , props.getProperty("line.separator"));
//		用户的账户名称：   
//		fields.put("userName" , props.getProperty("user.name"));
//		用户的主目录：    
//		fields.put("userHome" , props.getProperty("user.home"));
//		用户的当前工作目录：    
//		fields.put("userDir" , props.getProperty("user.dir"));

	}

	private static void memory() throws SigarException {
//		String road = System.getProperty("user.dir");
//		System.load(road + "/libsigar-amd64-linux.so");
		Sigar sigar = new Sigar();

		Mem mem = sigar.getMem();
		//内存总量
		fields.put("memoryTotal" , df.format(mem.getTotal()*1.0 / 1024L / 1024L / 1024L));
		//当前内存使用量
		fields.put("memoryUsed" , df.format(mem.getUsed()*1.0 / 1024L  / 1024L / 1024L));
		//当前内存剩余量
		fields.put("memoryFree" , df.format(mem.getFree()*1.0 / 1024L  / 1024L / 1024L));

		Swap swap = sigar.getSwap();
		//交换区总量
		fields.put("swapTotal" , df.format(swap.getTotal()*1.0 / 1024L  / 1024L / 1024L));
		//当前交换区使用量
		fields.put("swapUsed" , df.format(swap.getUsed()*1.0 / 1024L  / 1024L / 1024L));
		//当前交换区剩余量
		fields.put("swapFree" , df.format(swap.getFree()*1.0 / 1024L  / 1024L / 1024L));
	}

	private static void cpu() throws SigarException {
		Sigar sigar = new Sigar();

		CpuPerc perc = sigar.getCpuPerc();
		//获取当前cpu的空闲率
		fields.put("cpuIdle" , df.format(perc.getIdle()*100));
		//获取当前cpu的占用率
		fields.put("cpuCombined" , df.format(perc.getCombined()*100));


//		CpuInfo infos[] = sigar.getCpuInfoList();
//		CpuPerc cpuList[] = null;
//		cpuList = sigar.getCpuPercList();
//		for (int i = 0; i < infos.length; i++) {
//		不管是单块CPU还是多CPU都适用
//		CpuInfo info = infos[i];
////		CPU的总量MHz
//		fields.put("CPUMhz_" + (i + 1),  info.getMhz());
////		获得CPU的卖主，如：Intel
//		fields.put("CPUVendor_" + (i + 1),  info.getVendor());
////		获得CPU的类别，如：Celeron
//		fields.put("CPUModel_" + (i + 1),  info.getModel());
////		缓冲存储器数量
//		fields.put("CPUCacheSize_" + (i + 1),  info.getCacheSize());
		
//		//用户使用率
//		fields.put("CPUUser_" + (i + 1), CpuPerc.format(cpuList[i].getUser()));
//		//系统使用率
//		fields.put("CPUSys_" + (i + 1), CpuPerc.format(cpuList[i].getSys()));
//		//当前等待率
//		fields.put("CPUWait_" + (i + 1), CpuPerc.format(cpuList[i].getWait()));
//		//CPU当前错误率
//		fields.put("CPUNice_" + (i + 1), CpuPerc.format(cpuList[i].getNice()));
//		//当前空闲率
//		fields.put("CPUIdle_" + (i + 1), CpuPerc.format(cpuList[i].getIdle()));
//		//总的使用率
//		fields.put("CPUCombined_" + (i + 1), CpuPerc.format(cpuList[i].getCombined()));
//		printCpuPerc(cpuList[i]);
//		}
	}

//	private static void printCpuPerc(CpuPerc cpu) {
//		//用户使用率
//		fields.put("CPU用户使用率:    " , CpuPerc.format(cpu.getUser()));
//		//系统使用率
//		fields.put("CPU系统使用率:    " , CpuPerc.format(cpu.getSys()));
//		//当前等待率
//		fields.put("CPU当前等待率:    " , CpuPerc.format(cpu.getWait()));
//		//CPU当前错误率
//		fields.put("CPU当前错误率:    " , CpuPerc.format(cpu.getNice()));
//		//当前空闲率
//		fields.put("CPU当前空闲率:    " , CpuPerc.format(cpu.getIdle()));
//		//总的使用率
//		fields.put("CPU总的使用率:    " , CpuPerc.format(cpu.getCombined()));
//	}

	private static void os() {
		OperatingSystem OS = OperatingSystem.getInstance();
		//操作系统:    
		fields.put("osArch" , OS.getArch());

//		操作系统CpuEndian():    
//		fields.put("osCpuEndian" , OS.getCpuEndian());//
//		操作系统DataModel():    
//		fields.put("osDataModel" , OS.getDataModel());//
//		操作系统的描述:        
//		fields.put("osDescription" , OS.getDescription());
//		操作系统名称
//		fields.put("OS.getName():    " , OS.getName());
//		操作系统类型
//		fields.put("OS.getPatchLevel():    " , OS.getPatchLevel());//
//		操作系统的卖主
//		fields.put("osVendor" , OS.getVendor());
//		卖主名称
//		fields.put("osVendorCodeName" , OS.getVendorCodeName());
//		操作系统名称
//		fields.put("osVendorName" , OS.getVendorName());
//		操作系统卖主类型
//		fields.put("osVendorVersion" , OS.getVendorVersion());
//		操作系统的版本号
//		fields.put("osVersion" , OS.getVersion());
	}

//	private static void who() throws SigarException {
//		Sigar sigar = new Sigar();
//		Who who[] = sigar.getWhoList();
//		if (who != null && who.length > 0) {
//			for (int i = 0; i < who.length; i++) {
//				fields.put("当前系统进程表中的用户名" , String.valueOf(i));
//				Who _who = who[i];
//				用户控制台
//				fields.put("用户控制台:    " , _who.getDevice());
//				用户host
//				fields.put("用户host:    " , _who.getHost());
//				
//				fields.put("getTime():    " , _who.getTime());
//				当前系统进程表中的用户名
//				fields.put("当前系统进程表中的用户名:    " , _who.getUser());
//			}
//		}
//	}

	private static void file() throws Exception {
		Sigar sigar = new Sigar();
		FileSystem fslist[] = sigar.getFileSystemList();
		double devTotalSize = 0;
		double devFreeSize = 0;
		double devUsedSize = 0;
		double devAvailSize = 0;
		double avgDiskReads = 0;
		double avgDiskWrites = 0;
		for (int i = 0; i < fslist.length; i++) {
//			分区的盘符名称
//			fields.put(i+"num" , i);
			FileSystem fs = fslist[i];
//			分区的盘符名称
//			fields.put(i+"devName" , fs.getDevName());
//			分区的盘符名称
//			fields.put(i+"devDirName" , fs.getDirName());
//			盘符标志:    
//			fields.put(i+"devFlags" , fs.getFlags());
//			盘符类型:     文件系统类型，比如 FAT32、NTFS盘符类型:    
//			fields.put(i+"devSysTypeName" , fs.getSysTypeName());
//			文件系统类型名，比如本地硬盘、光驱、网络文件系统等
//			fields.put(i+"devTypeName" , fs.getTypeName());
//			文件系统类型ka
//			fields.put(i+"devType" , fs.getType());
			FileSystemUsage usage = null;
			usage = sigar.getFileSystemUsage(fs.getDirName());
			switch (fs.getType()) {
			case 0: 
				//TYPE_UNKNOWN ：未知
				break;
			case 1: 
				//TYPE_NONE
				break;
			case 2: 
				//TYPE_LOCAL_DISK : 本地硬盘
				//文件系统总大小
				devTotalSize += usage.getTotal()*1.0  / 1024L / 1024L;
				//文件系统剩余大小
				devFreeSize += usage.getFree()*1.0  / 1024L / 1024L;
				//文件系统可用大小
				devAvailSize += usage.getAvail()*1.0  / 1024L / 1024L;
				//文件系统已经使用量
				devUsedSize += usage.getUsed()*1.0  / 1024L / 1024L;
//				double usePercent = usage.getUsePercent() * 100D;
				//文件系统资源的利用率
//				fields.put(i+fs.getDevName() + "usePercent" , usePercent + "%");
				break;
			case 3:
				//TYPE_NETWORK ：网络
				break;
			case 4:
				//TYPE_RAM_DISK ：闪存
				break;
			case 5:
				//TYPE_CDROM ：光驱
				break;
			case 6:
				//TYPE_SWAP ：页面交换
				break;
			}

			//
			avgDiskReads += usage.getDiskReads();
			//fields.put(i+fs.getDevName() + "读出：    " , usage.getDiskReads());
			avgDiskWrites += usage.getDiskWrites();
			//fields.put(i+fs.getDevName() + "写入：    " , usage.getDiskWrites());
			fields.put("devTotalSize" , df.format(devTotalSize));
			fields.put("devFreeSize" , df.format(devFreeSize));
			fields.put("devUsedSize" , df.format(devUsedSize));
			fields.put("devAvailSize" , df.format(devAvailSize));
			fields.put("devUsePercent" , df.format(devUsedSize * 1.0 / devTotalSize *100));
			fields.put("avgDiskReads" , df.format(avgDiskReads / 1024L / fslist.length));
			fields.put("avgDiskWrites" , df.format(avgDiskWrites / 1024L / fslist.length));
		}
		//System.out.println(fields.toString());
		return;
	}

//	private static void net() throws Exception {
//		Sigar sigar = new Sigar();
//		String ifNames[] = sigar.getNetInterfaceList();
//		for (int i = 0; i < ifNames.length; i++) {
//			String name = ifNames[i];
//			NetInterfaceConfig ifconfig = sigar.getNetInterfaceConfig(name);
			//网络设备名
//			fields.put("netName_" + i, name);
			//IP地址
//			fields.put("netIpAddress_" + i, ifconfig.getAddress());
			//子网掩码
//			fields.put("netMask_" + i, ifconfig.getNetmask());
//			if ((ifconfig.getFlags() & 1L) <= 0L) {
//				System.out.println("!IFF_UP...skipping getNetInterfaceStat");
//				continue;
//			}
//			NetInterfaceStat ifstat = sigar.getNetInterfaceStat(name);
//
//			//接收的总包裹数
//			fields.put(name + "rxPackets" , ifstat.getRxPackets());
//			//发送的总包裹数
//			fields.put(name + "txPackets" , ifstat.getTxPackets());
//			//接收到的总字节数
//			fields.put(name + "RxBytes" , ifstat.getRxBytes());
//			//发送的总字节数
//			fields.put(name + "TxBytes" , ifstat.getTxBytes());
//			//接收到的错误包数
//			fields.put(name + "rxErrors" , ifstat.getRxErrors());
//			//发送数据包时的错误数
//			fields.put(name + "txErrors" , ifstat.getTxErrors());
//			//接收时丢弃的包数
//			fields.put(name + "txDropped" , ifstat.getRxDropped());
//			//发送时丢弃的包数
//			fields.put(name + "txDropped" , ifstat.getTxDropped());
//		}
//	}

//	private static void ethernet() throws SigarException {
//		Sigar sigar = null;
//		sigar = new Sigar();
//		String[] ifaces = sigar.getNetInterfaceList();
//		for (int i = 0; i < ifaces.length; i++) {
//			NetInterfaceConfig cfg = sigar.getNetInterfaceConfig(ifaces[i]);
//			if (NetFlags.LOOPBACK_ADDRESS.equals(cfg.getAddress()) || (cfg.getFlags() & NetFlags.IFF_LOOPBACK) != 0
//					|| NetFlags.NULL_HWADDR.equals(cfg.getHwaddr())) {
//				continue;
//			}
//			//IP地址
//			fields.put(cfg.getName() + "IPaddress:" , cfg.getAddress());
//			//网关广播地址
//			fields.put(cfg.getName() + "broadcast" , cfg.getBroadcast());
//			//网卡MAC地址
//			fields.put(cfg.getName() + "hwaddr" , cfg.getHwaddr());
//			//子网掩码
//			fields.put(cfg.getName() + "netmask" , cfg.getNetmask());
//			//网卡描述信息
//			fields.put(cfg.getName() + "description" , cfg.getDescription());
//			//网卡类型
//			fields.put(cfg.getName() + "type" , cfg.getType());
//		}
//	}
	
}
