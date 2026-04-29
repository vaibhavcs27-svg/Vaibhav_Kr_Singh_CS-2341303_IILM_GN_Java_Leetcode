class Solution {
    public int peakIndexInMountainArray(int[] nums) {
         int  start = 0;
        int end = nums.length - 1;
        int target = 0;
        while(start < end){
            int mid = start + (end - start)/2;
            if(nums[mid] > nums[mid+1]){
            end  = mid;
            mid = target;
            }
            else{
                start = mid + 1;
            }
        }
        return start;
    }
}