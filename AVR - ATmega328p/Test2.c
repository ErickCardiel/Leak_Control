/* ======================== Includes ======================= */

#include<avr/io.h>
#include<avr/pgmspace.h>
#include<avr/interrupt.h>
#include "UART0.h"

/* ======================== Defines ======================== */ 

/* 1000000ml = 1m^3  ::: 1000000ml / 2.5ml = 400000 pulses */

#define MLXPULSE 2.25
#define PULSEXM3 (1000000 / MLXPULSE)
#define SENDPULSES 600

#define FOSC 16000000 // Clock Speed
#define BAUD 9600
#define MYUBRR FOSC/16/BAUD-1

/* ===================== Program consts ===================== */

volatile unsigned int pulses = 0;
volatile unsigned int toggle = 0;
unsigned int prevPulse = 0;

/* ======================= Prototype ======================= */

void setup(void);

/* ======================= Function ======================== */

void setup(void)
{
	/*     PD0:RX     PD1:TX		*/
	/*     PB0 = PCINT0     		*/
	/* PCINT0 interruption setup   	*/
	DDRB &= ~(1 << DDB0);      // Clear PB0 pin
    PORTB |= (1 << PORTB0);    // turn on the Pull-up
    PCICR |= (1 << PCIE0);     // set PCIE0 to enable PCMSK0 scan
    PCMSK0 |= (1 << PCINT0);   // set PCINT0 to trigger an interrupt on state change 
	sei();
}

/* ========================= ISR ========================== */

ISR(PCINT0_vect)
{
	if( (PINB & (1 << PINB0)) && !toggle)   	/* LOW to HIGH pin change */
	{
		pulses++;
		toggle = 1;
	}

	else if(!(PINB & (1 << PINB0)) && toggle)	/* HIGH to LOW pin change */
		toggle = 0;
}


/* =================== Main function ==================== */

int main(void)
{
	char strPulses[]="";
	setup();
	UART0_Init(MYUBRR);		/*   UART0@9600,8,NP,1   */
	unsigned int cnt = 0;
	
	while(1)
	{
		if(prevPulse != pulses)
		{
			prevPulse = pulses;
		}

		if(pulses >= SENDPULSES)
		{
			itoa(strPulses,cnt,10);
			UART0_puts(strPulses);
			cnt++;
			prevPulse = 0;
			pulses = 0;
		}
	}
	return 0;
}