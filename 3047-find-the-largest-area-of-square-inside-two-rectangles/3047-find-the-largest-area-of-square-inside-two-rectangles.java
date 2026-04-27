class Solution {
    public long largestSquareArea(int[][] bottomLeft, int[][] topRight) {
        int n = bottomLeft.length;
        long maxArea = 0;

        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {

                int x_left = Math.max(bottomLeft[i][0], bottomLeft[j][0]);
                int y_bottom = Math.max(bottomLeft[i][1], bottomLeft[j][1]);
                int x_right = Math.min(topRight[i][0], topRight[j][0]);
                int y_top = Math.min(topRight[i][1], topRight[j][1]);

                if (x_right > x_left && y_top > y_bottom) {
                    int width = x_right - x_left;
                    int height = y_top - y_bottom;

                    int side = Math.min(width, height);
                    maxArea = Math.max(maxArea, (long) side * side);
                }
            }
        }

        return maxArea;
    }
}