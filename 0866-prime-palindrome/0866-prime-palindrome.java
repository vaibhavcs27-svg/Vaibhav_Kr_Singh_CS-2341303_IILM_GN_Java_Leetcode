class Solution {
    public int primePalindrome(int n) {
        if (n <= 2) return 2;
        if (n <= 3) return 3;
        if (n <= 5) return 5;
        if (n <= 7) return 7;
        if (n <= 11) return 11;
        for (int i = 1; i < 100000; i++) {
            String s = Integer.toString(i);
            String rev = new StringBuilder(s.substring(0, s.length() - 1)).reverse().toString();
            int num = Integer.parseInt(s + rev);
            if (num >= n && isPrime(num)) {
                return num;
            }
        }
        return -1;
    }
    public boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }
}