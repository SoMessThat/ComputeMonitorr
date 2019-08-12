package mess.computer;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.influxdb.InfluxDB;
import org.influxdb.InfluxDB.ConsistencyLevel;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.BatchPoints;
import org.influxdb.dto.Point;
import org.influxdb.dto.Point.Builder;
import org.influxdb.dto.Pong;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

/**
 * @description: InfluxDB数据库连接操作类
 * @copyright: 中电科(福州)新型智慧城市研究院 (c)2019
 * @createTime: 2019年7月18日下午4:46:19
 * @author：wu.kaibin
 * @version：1.0
 */
@Component
public class InfluxDBConnectionUtil {

	// 用户名
	@Value("${spring.influx.user}")
	private String username;
	
	// 密码
	@Value("${spring.influx.password}")
	private String password;
	
	// 连接地址
	@Value("${spring.influx.url}")
	private String url;
	
	// 数据库
	@Value("${spring.influx.database}")
	private String database;
	
	// 保留策略
	private String retentionPolicy;

	private InfluxDB influxDB;

	public InfluxDBConnectionUtil(String username, String password, String url, String database,
			String retentionPolicy) {
//		System.out.println("url" + url);
		this.username = username;
		this.password = password;
		this.url = url;
		this.database = database;
		this.retentionPolicy = retentionPolicy == null || retentionPolicy.equals("") ? "default" : retentionPolicy;
	}

	public InfluxDBConnectionUtil() {
//		System.out.println("url" + url);
		this.retentionPolicy = "default";
    }
	
	/**
	 * 创建数据库
	 * 
	 * @param dbName
	 */
	@SuppressWarnings("deprecation")
	public void createDB(String dbName) {
		influxDB.createDatabase(dbName);
	}

	/**
	 * 删除数据库
	 * 
	 * @param dbName
	 */
	@SuppressWarnings("deprecation")
	public void deleteDB(String dbName) {
		influxDB.deleteDatabase(dbName);
	}

	/**
	 * 测试连接是否正常
	 * 
	 * @return true 正常
	 */
	public boolean ping() {
		boolean isConnected = false;
		Pong pong;
		try {
			pong = influxDB.ping();
			if (pong != null) {
				isConnected = true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return isConnected;
	}

	/**
	 * 连接时序数据库 ，若不存在则创建
	 * 
	 * @return
	 */
	public InfluxDB influxDbBuild() {
		if (influxDB == null) {
			influxDB = InfluxDBFactory.connect(url, username, password);
		}
		influxDB.setRetentionPolicy(retentionPolicy);
		influxDB.setLogLevel(InfluxDB.LogLevel.NONE);
		return influxDB;
	}

	/**
	 * 创建自定义保留策略
	 * 
	 * @param policyName
	 *            策略名
	 * @param duration
	 *            保存天数
	 * @param replication
	 *            保存副本数量
	 * @param isDefault
	 *            是否设为默认保留策略
	 */
	public void createRetentionPolicy(String policyName, String duration, int replication, Boolean isDefault) {
		String sql = String.format("CREATE RETENTION POLICY \"%s\" ON \"%s\" DURATION %s REPLICATION %s ", policyName,
				database, duration, replication);
		if (isDefault) {
			sql = sql + " DEFAULT";
		}
		this.query(sql);
	}

	/**
	 * 创建默认的保留策略
	 * 
	 * @param 策略名：default，保存天数：30天，保存副本数量：1
	 *            设为默认保留策略
	 */
	public void createDefaultRetentionPolicy() {
		String command = String.format("CREATE RETENTION POLICY \"%s\" ON \"%s\" DURATION %s REPLICATION %s DEFAULT",
				"default", database, "1d", 1);
		this.query(command);
	}

	/**
	 * 查询
	 * 
	 * @param command
	 *            查询语句
	 * @return
	 */
	public QueryResult query(String command) {
		return influxDB.query(new Query(command, database));
	}

	/**
	 * 插入
	 * 
	 * @param measurement
	 *            表
	 * @param tags
	 *            标签
	 * @param fields
	 *            字段
	 */
	public void insert(String measurement, Map<String, String> tags, Map<String, Object> fields, long time,
			TimeUnit timeUnit) {
		Builder builder = Point.measurement(measurement);
		builder.tag(tags);
		builder.fields(fields);
		if (0 != time) {
			builder.time(time, timeUnit);
		}
		influxDB.write(database, retentionPolicy, builder.build());
	}

	/**
	 * 批量写入测点
	 * 
	 * @param batchPoints
	 */
	public void batchInsert(BatchPoints batchPoints) {
		influxDB.write(batchPoints);
	}

	/**
	 * 批量写入数据
	 * 
	 * @param database
	 *            数据库
	 * @param retentionPolicy
	 *            保存策略
	 * @param consistency
	 *            一致性
	 * @param records
	 *            要保存的数据（调用BatchPoints.lineProtocol()可得到一条record）
	 */
	public void batchInsert(final String database, final String retentionPolicy, final ConsistencyLevel consistency,
			final List<String> records) {
		influxDB.write(database, retentionPolicy, consistency, records);
	}

	/**
	 * 删除
	 * 
	 * @param command
	 *            删除语句
	 * @return 返回错误信息
	 */
	public String deleteMeasurementData(String command) {
		QueryResult result = influxDB.query(new Query(command, database));
		return result.getError();
	}

	/**
	 * 关闭数据库
	 */
	public void close() {
		influxDB.close();
	}

	/**
	 * 构建Point
	 * 
	 * @param measurement
	 * @param time
	 * @param fields
	 * @return
	 */
	public Point pointBuilder(String measurement, long time, Map<String, String> tags, Map<String, Object> fields) {
		Point point = Point.measurement(measurement).time(time, TimeUnit.MILLISECONDS).tag(tags).fields(fields).build();
		return point;
	}
	/**
	 * 转义字段
	 * 
	 * @createTime: 2019年7月18日 下午5:06:13
	 * @author: wu.kaibin
	 * @param column
	 * @return
	 */
	private String setColumns(String column){
		String[] cols = column.split("_");
		StringBuffer sb = new StringBuffer();
		for(int i=0; i< cols.length; i++){
			String col = cols[i].toLowerCase();
			if(i != 0){
				String start = col.substring(0, 1).toUpperCase();
				String end = col.substring(1).toLowerCase();
				col = start + end;
			}
			sb.append(col);
		}
		return sb.toString();
	}

	/**
	 * 整理列名、行数据
	 * 
	 * @param columns
	 * @param values
	 * @return
	 */
	public List<Map<String, String>> getQueryData(List<String> columns, List<List<Object>>  values){
		List<Map<String, String>> lists = new ArrayList<Map<String, String>>();

		for (List<Object> list : values) {
			Map<String, String> map = new HashMap<String, String>();
			for(int i=0; i< list.size(); i++){

				//字段名
				String propertyName = setColumns(columns.get(i));
				//相应字段值
				Object value = list.get(i);
				if ("time".equalsIgnoreCase(propertyName)) {
					//时间及时区转换
					DateTimeFormatter format = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss");
					value = format.format(Instant.parse((String) value).atZone(ZoneId.of("Asia/Shanghai")));
				}
				if (ObjectUtils.isEmpty(value)) {
					value = "0";
				}
				map.put(propertyName, value.toString());
			}

			lists.add(map);
		}

		return lists;
	}

}
