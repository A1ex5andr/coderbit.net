<?php
foreach($_POST as $key => $value)
    {
        $value = trim($value);
        $value = addslashes(htmlspecialchars($value));
        $form[$key] = $value;
    }

function redirect($time, $link, $text, $exit)
    {
    
        print"<html><head><meta http-equiv=\"refresh\" content=\"".$time."; url=".$link."\"></head><body>".$text."<p align=center><a href=\"".$link."\">Нажмите, что бы вернуться на сайт.</a><br><br></body></html>"; 
        if ($exit == '1'){exit;}
    
    }

function mailto($to,$subject,$message,$from)
    {
    
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
        $headers .= $from."\r\n";

        mail($to, $subject, $message, $headers);
           
    }    

// Проверка заполнены ли поля
    if(($form['name'] != '') AND ($form['text'] != ''))
		{
// Текст письма которое ты получишь			
			$message = '<html><head><title>Письмо с сайта</title></head><body>
			<p>С Вами хотят связаться:</p>
            Продукт: '. $form['product'] .'<br> 
			Ф.И.О.: '. $form['name'] .'<br>
			Телефон: '. $form['phone'] .'<br>
			Email: '. $form['email'] .'<br><br>
			Сообщение: '. $form['text'] .'<br>
			</body></html>';

            $message2 = '<html><head><title>Письмо с сайта</title></head><body>
            <p>Ваше сообщение получено:</p>
            Продукт: '. $form['product'] .'<br> 
            Ф.И.О.: '. $form['name'] .'<br>
            Телефон: '. $form['phone'] .'<br>
            Email: '. $form['email'] .'<br><br>
            Сообщение: '. $form['text'] .'<br>
            Мы свяжемся с Вами после обработки запроса,<br>
            С уважением, компания Аптрейд<br>
            </body></html>';

// your@site.email замени каким-то твоим емейлом от имени которого будет приходить сообщение
			$from = 'From: <sales@uptrade.com.ua>' . "\r\n";

// your@email Замени емейлом на который ты будешь получать сообщения 
			mailto('sales@uptrade.com.ua', 'UPTRADE contact', $message, $from);
            mailto($form['email'], 'UPTRADE contact', $message2,  $from);

// после отправки происходит переадресация обратно на страницу
			redirect('1', 'buy.html', '<h4 style="text-align: center;"> Спасибо, Ваше письмо отправлено.</h4>', '1');
			exit;
		}


?>		