class Solution {
    public String reorganizeString(String s) {
        int[] freq = new int[26];
        int n = s.length();

        for (char c : s.toCharArray()) {
            freq[c - 'a']++;
        }

        int max = 0, letter = 0;
        for (int i = 0; i < 26; i++) {
            if (freq[i] > max) {
                max = freq[i];
                letter = i;
            }
        }

        if (max > (n + 1) / 2) return "";

        char[] result = new char[n];
        int index = 0;

        while (freq[letter] > 0) {
            result[index] = (char)(letter + 'a');
            index += 2;
            freq[letter]--;
        }

        for (int i = 0; i < 26; i++) {
            while (freq[i] > 0) {
                if (index >= n) index = 1;
                result[index] = (char)(i + 'a');
                index += 2;
                freq[i]--;
            }
        }

        return new String(result);
    }
}