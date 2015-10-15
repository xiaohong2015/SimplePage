import java.util.Scanner;
public class Example {
	public static void main(String[] args) {
		Scanner scan = new Scanner(System.in);
		System.out.println("请输入一个英文字符串货解密字符串");
		String password = scan.nextLine();
		char[] array = password.toCharArray();
		for(int i = 0; i < array.length; i++) {
			array[i] = (char) (array[i] ^ 2000);
		}
		System.out.println("加密或解密结果如下:");
		system.out.println(new String(array));
	}
}