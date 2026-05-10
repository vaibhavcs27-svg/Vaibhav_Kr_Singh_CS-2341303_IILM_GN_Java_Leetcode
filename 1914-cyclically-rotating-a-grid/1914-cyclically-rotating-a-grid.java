class Solution {
    public int[][] rotateGrid(int[][] grid, int k) {
        int m = grid.length;
        int n = grid[0].length;
        int layers = Math.min(m, n) / 2;

        for (int layer = 0; layer < layers; layer++) {
            ArrayList<Integer> list = new ArrayList<>();

            for (int j = layer; j < n - layer; j++) {
                list.add(grid[layer][j]);
            }

            for (int i = layer + 1; i < m - layer - 1; i++) {
                list.add(grid[i][n - layer - 1]);
            }

            for (int j = n - layer - 1; j >= layer; j--) {
                list.add(grid[m - layer - 1][j]);
            }

            for (int i = m - layer - 2; i > layer; i--) {
                list.add(grid[i][layer]);
            }

            int size = list.size();
            int rotate = k % size;

            ArrayList<Integer> rotated = new ArrayList<>();

            for (int i = rotate; i < size; i++) {
                rotated.add(list.get(i));
            }

            for (int i = 0; i < rotate; i++) {
                rotated.add(list.get(i));
            }

            int idx = 0;

            for (int j = layer; j < n - layer; j++) {
                grid[layer][j] = rotated.get(idx++);
            }

            for (int i = layer + 1; i < m - layer - 1; i++) {
                grid[i][n - layer - 1] = rotated.get(idx++);
            }

            for (int j = n - layer - 1; j >= layer; j--) {
                grid[m - layer - 1][j] = rotated.get(idx++);
            }

            for (int i = m - layer - 2; i > layer; i--) {
                grid[i][layer] = rotated.get(idx++);
            }
        }

        return grid;
    }
}