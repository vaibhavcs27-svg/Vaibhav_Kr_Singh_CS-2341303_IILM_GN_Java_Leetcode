class Solution {
    public int mirrorDistance(int n) {
       int original = n;
       int reverse = 0;
       while(n>0){
        int no = n%10;
        reverse = reverse * 10 + no;
        n /=10;
       } 
       return Math.abs(reverse - original);
    }
}