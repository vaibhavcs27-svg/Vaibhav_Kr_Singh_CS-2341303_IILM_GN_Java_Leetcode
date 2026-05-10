class Solution {

    private int[] smallestPrimeFactor(int max) {
        int[] spf = new int[max + 1];

        for (int i = 0; i <= max; i++) {
            spf[i] = i;
        }

        for (int i = 2; i * i <= max; i++) {
            if (spf[i] == i) {
                for (int j = i * i; j <= max; j += i) {
                    if (spf[j] == j) {
                        spf[j] = i;
                    }
                }
            }
        }

        return spf;
    }

    private boolean isPrime(int x, int[] spf) {
        return x > 1 && spf[x] == x;
    }

    public int minJumps(int[] nums) {

        int n = nums.length;

        if (n == 1) return 0;

        int max = 0;

        for (int x : nums) {
            max = Math.max(max, x);
        }

        int[] spf = smallestPrimeFactor(max);

        Map<Integer, List<Integer>> bucket = new HashMap<>();

        for (int i = 0; i < n; i++) {

            int x = nums[i];

            Set<Integer> used = new HashSet<>();

            while (x > 1) {

                int p = spf[x];

                if (!used.contains(p)) {
                    bucket.computeIfAbsent(p, k -> new ArrayList<>()).add(i);
                    used.add(p);
                }

                while (x % p == 0) {
                    x /= p;
                }
            }
        }

        Queue<Integer> q = new LinkedList<>();

        int[] dist = new int[n];

        Arrays.fill(dist, -1);

        q.offer(0);

        dist[0] = 0;

        while (!q.isEmpty()) {

            int i = q.poll();

            int d = dist[i];

            if (i == n - 1) {
                return d;
            }

            if (i - 1 >= 0 && dist[i - 1] == -1) {
                dist[i - 1] = d + 1;
                q.offer(i - 1);
            }

            if (i + 1 < n && dist[i + 1] == -1) {
                dist[i + 1] = d + 1;
                q.offer(i + 1);
            }

            int val = nums[i];

            if (isPrime(val, spf) && bucket.containsKey(val)) {

                for (int next : bucket.get(val)) {

                    if (dist[next] == -1) {
                        dist[next] = d + 1;
                        q.offer(next);
                    }
                }

                bucket.remove(val);
            }
        }

        return -1;
    }
}