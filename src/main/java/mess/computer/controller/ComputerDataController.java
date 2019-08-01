package mess.computer.controller;

import java.util.List;
import java.util.Map;

import org.influxdb.dto.QueryResult;
import org.influxdb.dto.QueryResult.Result;
import org.influxdb.dto.QueryResult.Series;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mess.computer.ComputerStatusScheduled;
import mess.computer.InfluxDBConnectionUtil;

@RestController
@RequestMapping("computer/data")
public class ComputerDataController {

	@Autowired
	InfluxDBConnectionUtil influxDB;
	
	/**
	 * 获取该电脑的历史数据
	 * @createTime: 2019年7月18日 下午4:52:39
	 * @author: wu.kaibin
	 * @return
	 */
	@RequestMapping("/getComputerHisData")
	public List<Map<String, String>> getComputerHisData() {
		influxDB.influxDbBuild();
			QueryResult results = influxDB.query("select * from " + ComputerStatusScheduled.measurement );
			if(results.getResults() == null){
				return null;
			}
			for (Result result : results.getResults()) {
				List<Series> series= result.getSeries();
				if (ObjectUtils.isEmpty(series)) {
					continue ;
				}
				for (Series serie : series) {
					List<List<Object>>  values = serie.getValues();
					List<String> columns = serie.getColumns();
					return influxDB.getQueryData(columns, values);
				}
			}
			return null;
	}
}
