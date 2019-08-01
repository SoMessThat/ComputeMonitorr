package mess.computer;

import java.util.concurrent.atomic.AtomicInteger;

public class testValitate {
	public AtomicInteger inc =new AtomicInteger(0);
	public void increase() {
		inc.getAndIncrement();
	}
	public static void main(String[] args) {
		final testValitate test = new testValitate();
		for (int i = 0; i < 100; i++) {
			new Thread() {
				public void run() {
					for (int j = 0; j < 1000; j++)
						test.increase();
				}
			}.start();
		}
		while (Thread.activeCount() > 2) {  //保证前面的线程都执行完
			Thread.yield();
		}
		System.out.println(test.inc);
	}
}