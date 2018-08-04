---
title: "Eliminate articles when ordering in MySQL"
date: 2009-03-08
author: harmen-janssen
url: /articles/56/eliminate-articles-when-ordering-in-mysql
---

{{< intro >}}
<p>
When generating alphabetically ordered resultsets from your tables, it may be useful to eliminate <a href="http://en.wikipedia.org/wiki/Article_(grammar)">articles</a> (<i>the</i> and <i>a</i> in the English language).</p>
<p>The following is a simple method of doing this.</p>
{{< /intro >}}

Consider the following table of movie titles:

 ```

mysql> select * from movies order by name;
+----+----------------------+
| id | name                 |
+----+----------------------+
| 4  | A Day After Tomorrow |
| 7  | Aliens               |
| 6  | Juno                 |
| 5  | Reservoir Dogs       |
| 2  | The Big Lebowski     |
| 3  | The Dark Knight      |
| 1  | The Godfather        |
+----+----------------------+
7 rows in set (0.01 sec)
```

As you can see, articles mess with our order. Currently only 7 records reside in this table, so it's not hard to keep a clear view of this data, but when your database grows, it can be extremely annoying when half your data gets organized under "T".

### Root out articles

Luckily, it's easy to insert some logic in our query which'll make it possible to sort on the substring from the article on:

 ```

mysql> select id, name, if(name regexp '^(the|a|an) ', substring(name, instr(name, ' ') + 1), name) as orderName from movies order by orderName asc;
+----+----------------------+--------------------+
| id | name                 | orderName          |
+----+----------------------+--------------------+
| 7  | Aliens               | Aliens             |
| 2  | The Big Lebowski     | Big Lebowski       |
| 3  | The Dark Knight      | Dark Knight        |
| 4  | A Day After Tomorrow | Day After Tomorrow |
| 1  | The Godfather        | Godfather          |
| 6  | Juno                 | Juno               |
| 5  | Reservoir Dogs       | Reservoir Dogs     |
+----+----------------------+--------------------+
7 rows in set (0.00 sec)
```

See? By creating the field `orderName`, we get an alphabetically sorted list that actually makes sense.

Let me break it down, from the inside out:

 `substring(name, instr(name, ' ') + 1)`The [SUBSTRING](http://dev.mysql.com/doc/refman/5.1/en/string-functions.html#function_substring) function takes the substring of a string. In this case, we want the substring from the first space (which would come after the article, if any) to the end of the string. The [INSTR](http://dev.mysql.com/doc/refman/5.1/en/string-functions.html#function_instr) function provides the index we need to extract this substring. In this case, it returns the position of the first space it encounters in the string. I append 1 to the result because otherwise all `orderName` fields would start with a space.

 `if(name regexp '^(the|a|an) ', substring(...), name)`The [IF](http://dev.mysql.com/doc/refman/5.0/en/control-flow-functions.html#function_if) function will return the substring as extracted in the above example, if the string matches the regular expression, or otherwise just the name as it were.

It's that simple! Here is the entire query for you to copy and paste:

 ```
SELECT
	id,
	name,
	IF(name REGEXP '^(the|a|an) ',
		SUBSTRING(name, INSTR(name, ' '	) + 1),
		name
	) AS orderName
FROM 
	movies
ORDER BY 
	orderName ASC
```

### Adding articles in different languages

If you want to add more articles, for different languages for instance, just edit the regular expression. For instance, a regular expression containing both French and English articles could look like this:

 `regexp '^(the|a|an|le|la) '`That's it! Let me know if you have improvements.