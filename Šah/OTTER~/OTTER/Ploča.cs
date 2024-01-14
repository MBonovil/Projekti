using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OTTER
{
    class Ploča
    {
        Polje[,] ploca;
        public Ploča()
        {
               Ploca = kreirajPlocu(8);
        }

        public Polje[,] Ploca { get => ploca; set => ploca = value; }

        public static Polje[,] kreirajPlocu(int n)
        {
            if (n < 0)
                throw new ArgumentException("n mora biti pozitivan.", "n");
            string[] nizImeTemp = new string[] { "A", "B", "C", "D", "E", "F", "G", "H"};
            Polje[,] polja = new Polje[n,n];


            int level = 0,
            counter = 1;
            int left = 54;
            int top = 54;
            while (level < (int)Math.Ceiling(n / 2f))
            {
                int x = level;
                int y = level;
                for (; x < n - level; x++)
                {
                  
                 
                    string ime = nizImeTemp[x].ToString() + (8-y).ToString();
                    Polje p = new Polje(ime.ToString(), x, y, (54+75*x), (54+50*y));
                    left += 75;
                    polja[x, y] = p;
                }
                left -= 75;
                top += 50;
                for (y++, x--; y < n - level; y++)
                {
                   
                    string ime = nizImeTemp[x].ToString() + (8 - y).ToString();
                    Polje p = new Polje(ime.ToString(), x, y, (54 + 75 * x), (54 + 50 * y));
                    top += 50;
                    polja[x, y] = p;
                }
                top -= 50;
                for (x--, y--; x >= level; x--)
                {
                  
                    string ime = nizImeTemp[x].ToString() + (8 - y).ToString();
                    Polje p = new Polje(ime.ToString(), x, y, (54 + 75 * x), (54 + 50 * y));
                    left -= 75;
                    polja[x, y] = p;
                }
                top -= 50;
                for (y--, x++; y >= level + 1; y--)
                { 
                 
                    string ime = nizImeTemp[x].ToString() + (8 - y).ToString();
                    Polje p = new Polje(ime.ToString(), x, y, (54 + 75 * x), (54 + 50 * y));
                    top -= 50;
                    polja[x, y] = p;

                }
                level++;
            }
            return polja;
        }
      
    }
}
