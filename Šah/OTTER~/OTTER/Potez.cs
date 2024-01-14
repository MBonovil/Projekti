using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OTTER
{
    class Potez
    {
        public bool KretanjeUStranu(int InX, int InY, int NewX, int NewY) 
        {
            if (InX > NewX && InY == NewY || InX < NewX && InY == NewY) 
            {
                return true;
            }

            return false;
        }
        public bool KretanjeVertikalno(int InX, int InY, int NewX, int NewY)
        {
            if (InX == NewX && InY < NewY || InX == NewX && InY > NewY)
            {
                return true; 
            }
            return false;

        }
        public bool rookmove(int InX,int InY,int NewX,int NewY)
        {
            if(InX==NewX && InY<NewY || InX==NewX && InY>NewY)
            {
                return true;
            }
            if(InX<NewX && InY==NewY || InX>NewX && InY==NewY )
            {
                return true;
            }
            return false;
            
        }
//PIJUN//
        public bool JedanKorakIgrac1(int InX, int InY, int NewX, int NewY)
        {
            if (InX == NewX && InY - NewY == 1)
            {
                return true;
            }

            return false;
        }
        public bool JedanKorakIgrac2(int InX, int InY, int NewX, int NewY)
        {
            if (InX == NewX && NewY - InY == 1)
            {
                return true;
            }

            return false;

        }
//KRALJ//
        public bool JedanKorakSviSmjerovi(int InX, int InY, int NewX, int NewY)
        {
            if ((InX == NewX && NewY - InY == 1) | (InX == NewX && InY - NewY == 1) | (InX - NewX == 1 && NewY == InY) | (NewX - InX == 1 && NewY == InY) | (InX - NewX == 1 && InY - NewY == 1) | (InX - NewX == 1 && NewY - InY == 1) | (NewX - InX == 1 && InY - NewY == 1) | (NewX - InX == 1 && NewY - InY == 1))
            {
                return true;
            }
            return false;

        }
//PIJUN//
        public bool DvaKorakaIgrac1(int InX, int InY, int NewX, int NewY)
        {
            if (InX == NewX && InY - NewY == 2 && InY == 6)
            {
                return true;
            }

            return false;
        }
        public bool DvaKorakaIgrac2(int InX, int InY, int NewX, int NewY)
        {
            if (InX == NewX && NewY - InY == 2 && InY == 1)
            {
                return true;
            }
            return false;
        }
        public bool PotezZaUbijanjeIgrac1(int InX, int InY, int NewX, int NewY)
        {
            if (NewX == InX + 1 | NewX == InX - 1 && NewY == InY - 1)
            {
                return true;
            }

            return false;
        }
        public bool PotezZaUbijanjeIgrac2(int InX, int InY, int NewX, int NewY)
        {
            if (NewX == InX - 1 | NewX == InX + 1 && NewY == InY + 1)
            {
                return true;
            }
            return false;
        }
        public bool PotezZaNeubijanjeIgrac1(int InX, int InY, int NewX, int NewY)
        {
            if (InX == NewX && NewY == InY - 1)
            {
                return false;
            }
            return true;
        }
        public bool PotezZaNeubijanjeIgrac2(int InX, int InY, int NewX, int NewY)
        {
            if (InX == NewX && NewY == InY + 1)
            {
                return false;
            }
            return true;

        }


//KONJ//
        public bool KonjKretanje(int InX, int InY, int NewX, int NewY)
        {
            if ((InX - NewX == 1 && InY - NewY == 2) | (NewX - InX == 1 && InY - NewY == 2) | (NewX - InX == 1 && NewY - InY == 2) | (InX - NewX == 1 && NewY - InY == 2) | (InX - NewX == 2 && NewY - InY == 1) | (InX - NewX == 2 && InY - NewY == 1) | (NewX - InX == 2 && InY - NewY == 1) | (NewX - InX == 2 && NewY - InY == 1))
            {
                return true;
            }

            return false;

        }
//LOVAC//
        public bool LovacKretanje(int InX, int InY, int NewX, int NewY)
        {

            int XDifference;
            int YDifference;

            if (InY > NewY)
            {
                YDifference = InY - NewY;

            }
            else
            {
                YDifference = NewY - InY;
            }

            if (InX > NewX)
            {

                XDifference = InX - NewX;
            }

            else
            {
                XDifference = NewX - InX;
            }

            if (KretanjeUStranu(InX, InY, NewX, NewY) != true && KretanjeVertikalno(InX, InY, NewX, NewY) != true && XDifference / YDifference == 1)
            {
                return true;
            }

            return false;

        }
//KRALJICA//
        public bool KretanjeKraljice(int InX, int InY, int NewX, int NewY)
        {
            if (KretanjeVertikalno(InX, InY, NewX, NewY) == true | KretanjeUStranu(InX, InY, NewX, NewY) == true | LovacKretanje(InX, InY, NewX, NewY) == true)
            {
                return true;
            }

            return false;
        }

//ROŠADA//
        public bool RosadaKraljaiTopaNaDesnojstr(int InX, int InY, int NewX, int NewY, char[,] Board)
        {
            if (Board[6, 7] == ' ' && Board[5, 7] == ' ' && InX == 4 && InY == 7 && NewX == 6 && NewY == 7 && Board[4, 7] == 'K' && Board[7, 7] == 'R')
            {
                return true;
            }

            return false;

        }
        public bool RosadaKraljaiTopanaLijevojstr(int InX, int InY, int NewX, int NewY, char[,] Board)
        {
            if (Board[3, 7] == ' ' && Board[2, 7] == ' ' && InX == 4 && InY == 7 && NewX == 2 && NewY == 7 && Board[4, 7] == 'K' && Board[0, 7] == 'R')
            {
                return true;
            }

            return false;


        }
        public bool RosadaKraljaiTopanaDesnojstrIgrac2(int InX, int InY, int NewX, int NewY, char[,] Board)
        {
            if (Board[5, 0] == ' ' && Board[6, 0] == ' ' && InX == 4 && InY == 0 && NewX == 6 && NewY == 0 && Board[4, 0] == 'k' && Board[7, 0] == 'r')
            {
                return true;
            }

            return false;
        }

        public bool RosadaKraljaiTopanaLjevojstrIgrac2(int InX, int InY, int NewX, int NewY, char[,] Board)
        {
            if (Board[3, 0] == ' ' && Board[2, 0] == ' ' && InX == 4 && InY == 0 && NewX == 2 && NewY == 0 && Board[4, 0] == 'k' && Board[0, 0] == 'r')
            {
                return true;
            }
            return false;
        }

    }

}
