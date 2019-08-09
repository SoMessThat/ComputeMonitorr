/**
 * 
 */
package mess.computer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 1. 主类：@SpringBootApplication
 * 2. DAO扫描：@MapperScan
 * 3. 事务AOP：@ImportResource
 * 4. 事务注解：@EnableTransactionManagement
 
 * @author wuzhb
 *
 */
@SpringBootApplication // 启动类
@ImportResource(locations = {"classpath:config/applicationContext-transaction.xml"}) // 事务AOP
@EnableTransactionManagement // 可选：事务Annotation（等同于xml配置方式的 <tx:annotation-driven />）
@EnableScheduling   // 1.开启定时任务
@EnableAsync        // 2.开启多线程
public class ComputerApplication implements CommandLineRunner  {

	public void run(String... args) throws Exception {
		
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		SpringApplication.run(ComputerApplication.class, args);
	}

}
