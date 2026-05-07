class Solution {
    public boolean containsDuplicate(int[] nums) {
       HashSet<Integer> map = new HashSet<>();

       for(int num : nums){
         if(map.contains(num)) return true;
        map.add(num);
       }
       return false;
    }
}