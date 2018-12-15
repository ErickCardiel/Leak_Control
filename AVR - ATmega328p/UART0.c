#include <avr/io.h>

void UART0_putchar(unsigned char data)
{
	while(!(UCSR0A & (1<<UDRE0)));
	UDR0 = data;
}


void UART0_puts(char *str)
{
  while(*str){
      UART0_putchar(*str);
	  str++;
  }
}

void UART0_Init(unsigned int ubrr)	
{
	UBRR0H = (unsigned char)(ubrr>>8);
	UBRR0L = (unsigned char)ubrr;
	UCSR0B = (1<<RXEN0)|(1<<TXEN0);
	UCSR0C = (3<<UCSZ00);		
}


void itoa(char* str, unsigned int number, unsigned char base)
{
	unsigned int tmpNum,res;
	int j=0,i=0;
	char tmpChar;

	while(number != 0)
	{
		tmpNum = number;
		number = number/base;
		res = tmpNum-(base*number);
		if(res < 10)
		   *(str+i) = res+'0';
		else
			*(str+i) = res+55;   
		i++;
	}
	if(i == 0)
	{
		*(str+i) = '0';
		i++;
	}
	*(str+i) = '\0';
    i--;
	while(i > j)
	{
		tmpChar = *(str+i);
		*(str+i) = *(str+j);
		*(str+j) = tmpChar;
		i--;
		j++;
	}
}