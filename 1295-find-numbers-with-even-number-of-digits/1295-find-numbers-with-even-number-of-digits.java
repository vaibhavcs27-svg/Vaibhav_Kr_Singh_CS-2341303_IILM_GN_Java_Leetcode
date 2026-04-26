class Solution {
    public int findNumbers(int[] nums) {
        int count = 0;

        for(int num : nums){
            int digits = even(num);

            if(digits % 2 == 0){
                count++;
            }
        }

        return count;
    }

    static int even(int num){
        if(num == 0) return 1;

        int count = 0;
        while(num > 0){
            count++;
            num /= 10;
        }
        return count;
    }
}