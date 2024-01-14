using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OTTER
{
    
    public class Figura
    {
        private bool active;
        private string ime;
        private string pozicija;
        private string boja;
        private string slika;

        
        public string Ime { get => ime; set => ime = value; }
        public string Pozicija { get => pozicija; set => pozicija = value; }
        public string Boja { get => boja; set => boja = value; }
        public string Slika { get => slika; set => slika = value; }
        public bool Active { get => active; set => active = value; }
        

        public Figura(string i, string p, string b, bool a, string s)
         
        {
            this.Ime = i;
            this.Active = a;
            this.Pozicija =p;
            this.Boja = b;
            this.Slika = s;

            

        }

        public Figura ()
        {

        }
        List<string> PocPoz = new List<string>();
        public Figura[] kreirajPijune(string boja)
        {
            Figura[] pijuni = new Figura[8];
            string[] nizImeTemp = new string[] { "A", "B", "C", "D", "E", "F", "G", "H" };
            for (int i = 0; i < 8; i++)
            {
                string ime = "Pijun_" + boja + "_" + (i + 1).ToString();
                string pozicija = "";
                if ("crna" == boja)
                {
                    pozicija = nizImeTemp[i] + "7";
                }
                else
                {
                    pozicija = nizImeTemp[i] + "2";
                }
                if(pozicija==nizImeTemp[i]+"7")
                {
                    Figura pijun_c = new Figura(ime, pozicija, boja, true, "sprites\\pijun_c.png");
                    pijuni[i] = pijun_c;
                }
                else
                {
                    Figura pijun_b = new Figura(ime, pozicija, boja, true, "sprites\\pijun_b.png");
                    pijuni[i] = pijun_b;
                }
                
            }
            PocPoz.Add(pijuni.ToString());
            return pijuni;
        }
        public Figura[] kreirajTopove(string boja)
        {
            Figura[] topovi = new Figura[2];
            string[] nizImeTemp = new string[] { "A","H" };
            for (int i = 0; i < 2; i++)
            {
                string ime = "Top_" + boja + "_" + (i + 1).ToString();
                string pozicija = "";
                if ("crna" == boja)
                {
                    pozicija = nizImeTemp[i] + "8";
                }
                else
                {
                    pozicija = nizImeTemp[i] + "1";
                }
                if(pozicija=="A8"||pozicija=="H8")
                {
                    Figura top_c = new Figura(ime, pozicija, boja, true, "sprites\\top_c.png");
                    topovi[i] = top_c;
                }
                else
                {
                    Figura top_b = new Figura(ime, pozicija, boja, true, "sprites\\top_b.png");
                    topovi[i] = top_b;
                }
            }
            PocPoz.Add(topovi.ToString());
            return topovi;
        }
        public Figura[] kreirajKonje(string boja)
        {
            Figura[] konji = new Figura[2];
            string[] nizImeTemp = new string[] { "B", "G" };
            for (int i = 0; i < 2; i++)
            {
                string ime = "Konj_" + boja + "_" + (i + 1).ToString();
                string pozicija = "";
                if ("crna" == boja)
                {
                    pozicija = nizImeTemp[i] + "8";
                }
                else
                {
                    pozicija = nizImeTemp[i] + "1";
                }
                if(pozicija=="B8"||pozicija=="G8")
                {
                    Figura konj_c = new Figura(ime, pozicija, boja, true, "sprites\\konj_c.png");
                    konji[i] = konj_c;
                }
                else
                {
                    Figura konj_b = new Figura(ime, pozicija, boja, true, "sprites\\konj_b.png");
                    konji[i] = konj_b;
                }
                
            }
            PocPoz.Add(konji.ToString());
            return konji ;
        }
        public Figura[] kreirajLovca(string boja)
        {
            Figura[] lovci = new Figura[2];
            string[] nizImeTemp = new string[] { "C", "F" };
            for (int i = 0; i < 2; i++)
            {
                string ime = "Lovac_" + boja + "_" + (i + 1).ToString();
                string pozicija = "";
                if ("crna" == boja)
                {
                    pozicija = nizImeTemp[i] + "8";
                }
                else
                {
                    pozicija = nizImeTemp[i] + "1";
                }
                if(pozicija=="C1"||pozicija=="F1")
                {
                    Figura lovac_b = new Figura(ime, pozicija, boja, true, "sprites\\lovac_b.png");
                    lovci[i] = lovac_b;
                }
                else
                {
                    Figura lovac_c = new Figura(ime, pozicija, boja, true, "sprites\\lovac_c.png");
                    lovci[i] = lovac_c;
                }
                
            }
            PocPoz.Add(lovci.ToString());
            return lovci;
        }
        public Figura[] kreirajKraljeve(string boja)
        {
            Figura[] kraljevi = new Figura[8];
            string[] nizImeTemp = new string[] {"E"};
            for (int i = 0; i < 1; i++)
            {
                string ime = "Kralj_" + boja + "_" + (i + 1).ToString();
                string pozicija = "";
                if ("crna" == boja)
                {
                    pozicija = nizImeTemp[i] + "8";
                }
                else
                {
                    pozicija = nizImeTemp[i] + "1";
                }
                if(pozicija=="E8")
                {
                    Figura kralj_c = new Figura(ime, pozicija, boja, true, "sprites\\kralj_c.png");
                    kraljevi[i] = kralj_c;
                }
                else
                {
                    Figura kralj_b = new Figura(ime, pozicija, boja, true, "sprites\\kralj_b.png");
                    kraljevi[i] = kralj_b;
                }

                
            }
            PocPoz.Add(kraljevi.ToString());
            return kraljevi;
        }
        public Figura[] kreirajKraljice(string boja)
        {
            Figura[] kraljice = new Figura[8];
            string[] nizImeTemp = new string[] { "D" };
            for (int i = 0; i < 1; i++)
            {
                string ime = "Kraljica_" + boja + "_" + (i + 1).ToString();
                string pozicija = "";
                if ("crna" == boja)
                {
                    pozicija = nizImeTemp[i] + "8";
                }
                else
                {
                    pozicija = nizImeTemp[i] + "1";
                }
                if(pozicija=="D8")
                {
                    Figura kraljica_c = new Figura(ime, pozicija, boja, true, "sprites\\kraljica_c.png");
                    kraljice[i] = kraljica_c;
                }
                else
                {
                    Figura kraljica_b = new Figura(ime, pozicija, boja, true, "sprites\\kraljica_b.png");
                    kraljice[i] = kraljica_b;
                }
                
            }
            PocPoz.Add(kraljice.ToString());
            return kraljice;
            
        }
        
        



    }
}
