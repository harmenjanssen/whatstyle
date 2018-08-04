---
title: "Generate unique slugs in CakePHP"
date: 2008-10-23
author: harmen-janssen
url: /articles/52/generate_unique_slugs_in_cakephp
---

{{< intro >}}
<p>
I believe it was Wordpress who came up with the term "slug". It has been adopted by many other systems though, and it basically means the following: a unique identifier which can be used in a URL to create a permalink to a page.</p>
<p>At least, that's my interpretation of it. In this article I will show you how you can generate a unique slug easily when working with the <a href="http://cakephp.org">CakePHP Framework</a>.</p>
{{< /intro >}}

Since the slug should be unique across records in the same database table, the best place to store slug-generating functionality is in the `AppModel`, which is, strictly speaking, the only business logic layer that may access the database.

If you haven't got an `AppModel` created yet, add one in `/app/app_model.php`. You may fill it with the following code:

 ```
<?php class AppModel extends Model {

		function createSlug ($string, $id=null) {
			$slug = Inflector::slug ($string,'-');
			$slug = low ($slug);
			$i = 0;
			$params = array ();
			$params ['conditions']= array();
			$params ['conditions'][$this-?>name.'.slug']= $slug;
			if (!is_null($id)) {
				$params ['conditions']['not'] = array($this->name.'.id'=>$id);
			}
			while (count($this->find ('all',$params))) {
				if (!preg_match ('/-{1}[0-9]+$/', $slug )) {
					$slug .= '-' . ++$i;
				} else {
					$slug = preg_replace ('/[0-9]+$/', ++$i, $slug );
				}
				$params ['conditions'][$this->name . '.slug']= $slug;
			}
			return $slug;
		}
	}
?>
```

### Goal

What this code does, is providing a method, `createSlug ()`, which can be accessed from all models in your application. It'll normalize the string, make it URL-friendly and last but not least, it makes it unique.

To demonstrate the "unique" part, let's say we've got a record with the title "I love CakePHP". The `createSlug` method will turn this into "`i-love-cakephp`". Human friendly _and_ search-engine friendly.  
 What happens when I wish to create two more items in my database called "I love CakePHP"? The `createSlug` method will generate the following two slugs: `i-love-cakephp-1` and `i-love-cakephp-2`.

This way users can bookmark your URLs and always end up in the right place, even though the titles of your records may be similar.

### How to use?

It's simple, really. Since the method is created in the `AppModel` base class, you can invoke it from every model in your application. When saving a record, you can simply call...

 `$slug = $this->generateSlug ('my title');`...from within your models, or...

 `$slug = $this->MyModel->generateSlug ('my title');`...from within your controllers, right before you insert new data.

Note that you have to pass the id from the current record when you're modifying existing records, so it can exclude that from its check, like this:

 `$slug = $this->generateSlug ('my title', 10);`### How does it work?

 ```
$slug = Inflector::slug ($string,'-');
$slug = low ($slug);
```

These lines normalize the string into a human friendly, easily readable slug.

 ```
$params = array ();
$params ['conditions']= array();
$params ['conditions'][$this->name.'.slug']= $slug;
if (!is_null($id)) {
	$params ['conditions']['not'] = array($this->name.'.id'=>$id);
}
```

This code will create the `$params` array, which is used in checking wether or not a slug already exists.

 ```
while (count($this->find ('all',$params))) {
	if (!preg_match ('/-{1}[0-9]+$/', $slug )) {
		$slug .= '-' . ++$i;
	} else {
		$slug = preg_replace ('/[0-9]+$/', ++$i, $slug );
	}
	$params ['conditions'][$this->name . '.slug']= $slug;
}
```

This `while` loop will append the slug with an incrementing value until no results are returned from the `Model::find` method. This ensures the final slug string is unique.

I've used this method in multiple projects now, and have found it very useful. I hope it'll be of some use to you as well, and would like to know what you think this method can do better. Let me know in the comments!