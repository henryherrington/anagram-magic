# f = open("./word_lists/all_words.txt", "rb")
# text = f.read().decode(errors='replace')

def allCharsInAlphabet(word):
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    for char in word[:-1]:
        if (not(char in alphabet)):
            print(word)
            return False
    return True

# open('./word_lists/unicode_words.txt','w').write(text)
open('./word_lists/new_words_9.txt','w').writelines(line for line in open('./word_lists/unicode_words.txt') if (len(line) <= 9 and allCharsInAlphabet(line)))
