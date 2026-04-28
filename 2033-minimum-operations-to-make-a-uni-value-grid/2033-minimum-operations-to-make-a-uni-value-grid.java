import java.util.*;
class Solution {
    public int minOperations(int[][] grid, int x) {
        List<Integer> list = new ArrayList<>();
        for (int[] row : grid) {
            for (int num : row) {
                list.add(num);
            }
        }
        Collections.sort(list);
        int n = list.size();
        int median = list.get(n / 2);
        int operations = 0;
        for (int num : list) {
            if ((num - median) % x != 0) {
                return -1;
            }
            operations += Math.abs(num - median) / x;
        }
        return operations;
    }
}