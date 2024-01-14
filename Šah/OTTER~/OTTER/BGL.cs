using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Media;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics;

namespace OTTER
{
    /// <summary>
    /// -
    /// </summary>
    public partial class BGL : Form
    {
        /* ------------------- */
        #region Environment Variables

        List<Func<int>> GreenFlagScripts = new List<Func<int>>();

        /// <summary>
        /// Uvjet izvršavanja igre. Ako je <c>START == true</c> igra će se izvršavati.
        /// </summary>
        /// <example><c>START</c> se često koristi za beskonačnu petlju. Primjer metode/skripte:
        /// <code>
        /// private int MojaMetoda()
        /// {
        ///     while(START)
        ///     {
        ///       //ovdje ide kod
        ///     }
        ///     return 0;
        /// }</code>
        /// </example>
        public static bool START = true;

        //sprites
        /// <summary>
        /// Broj likova.
        /// </summary>
        public static int spriteCount = 0, soundCount = 0;

        /// <summary>
        /// Lista svih likova.
        /// </summary>
        //public static List<Sprite> allSprites = new List<Sprite>();
        public static SpriteList<Sprite> allSprites = new SpriteList<Sprite>();

        //sensing
        int mouseX, mouseY;
        Sensing sensing = new Sensing();

        //background
        List<string> backgroundImages = new List<string>();
        int backgroundImageIndex = 0;
        string ISPIS = "";

        SoundPlayer[] sounds = new SoundPlayer[1000];
        TextReader[] readFiles = new StreamReader[1000];
        TextWriter[] writeFiles = new StreamWriter[1000];
        bool showSync = false;
        int loopcount;
        DateTime dt = new DateTime();
        String time;
        double lastTime, thisTime, diff;

        #endregion
        /* ------------------- */
        #region Events

        private void Draw(object sender, PaintEventArgs e)
        {
            Graphics g = e.Graphics;

            try
            {                
                foreach (Sprite sprite in allSprites)
                {                    
                    if (sprite != null)
                        if (sprite.Show == true)
                        {
                            g.DrawImage(sprite.CurrentCostume, new Rectangle(sprite.X, sprite.Y, sprite.Width, sprite.Heigth));
                        }
                    if (allSprites.Change)
                        break;
                }
                if (allSprites.Change)
                    allSprites.Change = false;
            }
            catch
            {
                //ako se doda sprite dok crta onda se mijenja allSprites
                MessageBox.Show("Greška!");
            }
        }

        private void startTimer(object sender, EventArgs e)
        {
            timer1.Start();
            timer2.Start();
            Init();
        }

        private void updateFrameRate(object sender, EventArgs e)
        {
            updateSyncRate();
        }

        /// <summary>
        /// Crta tekst po pozornici.
        /// </summary>
        /// <param name="sender">-</param>
        /// <param name="e">-</param>
        public void DrawTextOnScreen(object sender, PaintEventArgs e)
        {
            Graphics g = e.Graphics;

            var brush = new SolidBrush(Color.WhiteSmoke);
            string text = ISPIS;

            SizeF stringSize = new SizeF();
            Font stringFont = new Font("Arial", 14);
            stringSize = e.Graphics.MeasureString(text, stringFont);

            using (Font font1 = stringFont)
            {
                RectangleF rectF1 = new RectangleF(0, 0, stringSize.Width, stringSize.Height);
                e.Graphics.FillRectangle(brush, Rectangle.Round(rectF1));
                e.Graphics.DrawString(text, font1, Brushes.Black, rectF1);
            }
        }

        private void mouseClicked(object sender, MouseEventArgs e)
        {
           
            //sensing.MouseDown = true;
            sensing.MouseDown = true;
        }

        private void provjeriSahMat(string boja)
        {
            Potez p = new Potez();
            for(int i=0; i<32; i++)
            {
                string pozicijaOdKralja = "";
                string bojaOdKralja = "";
                for (int j = 0; j < 32; j++)
                {
                    if (figure[j].Ime.Contains("Kralj") && figure[j].Boja != boja)
                    {
                        pozicijaOdKralja = figure[j].Pozicija;
                        bojaOdKralja = figure[j].Boja;
                    }
                    if(figure[j].Ime.Contains("Kralj") && figure[j].Boja != boja && figure[i].Active == false)
                    {
                        bijeliJeNaPotezu = false;
                        crniJeNaPotezu = false;
                        ISPIS = "Sah Mat";
                    }

                }

                

                Figura f = figure[i];
                if(f.Active == true && f.Boja == boja) 
                {


                    if (f.Ime.Contains("Pijun") && boja == "bijela")
                    {
                        if (p.PotezZaUbijanjeIgrac1(vratiPoziciju_XY(f.Pozicija)["x"], vratiPoziciju_XY(f.Pozicija)["y"], vratiPoziciju_XY(pozicijaOdKralja)["x"], vratiPoziciju_XY(pozicijaOdKralja)["y"]) == true)
                        {
                            ISPIS = "Sah ";
                            sah = true;
                            break;
                            //bijeliJeNaPotezu = false;
                            //crniJeNaPotezu = false;
                        }
                        else
                        {
                            sah = false;
                        }

                    }
                    else if (f.Ime.Contains("Pijun") && boja == "crna") {
                        if (p.PotezZaUbijanjeIgrac2(vratiPoziciju_XY(f.Pozicija)["x"], vratiPoziciju_XY(f.Pozicija)["y"], vratiPoziciju_XY(pozicijaOdKralja)["x"], vratiPoziciju_XY(pozicijaOdKralja)["y"]) == true)
                        {
                            ISPIS = "Sah ";
                            sah = true;
                            break;
                            //bijeliJeNaPotezu = false;
                            //crniJeNaPotezu = false;
                        }
                        else
                        {
                            sah = false;
                        }

                    } else if (f.Ime.Contains("Konj") && f.Boja != bojaOdKralja)
                    {
                        if (p.KonjKretanje(vratiPoziciju_XY(f.Pozicija)["x"], vratiPoziciju_XY(f.Pozicija)["y"], vratiPoziciju_XY(pozicijaOdKralja)["x"], vratiPoziciju_XY(pozicijaOdKralja)["y"]) == true)
                        {
                            ISPIS = "Sah ";
                            sah = true;
                            break;
                            //bijeliJeNaPotezu = false;
                            //crniJeNaPotezu = false;
                        }
                        else
                        {
                            sah = false;
                        }

                    } else if(f.Ime.Contains("Kraljica") && f.Boja != bojaOdKralja)
                    {
                        if (p.KretanjeKraljice(vratiPoziciju_XY(f.Pozicija)["x"], vratiPoziciju_XY(f.Pozicija)["y"], vratiPoziciju_XY(pozicijaOdKralja)["x"], vratiPoziciju_XY(pozicijaOdKralja)["y"]) == true)
                        {
                            ISPIS = "Sah ";
                            sah = true;
                            break;
                            //bijeliJeNaPotezu = false;
                            //crniJeNaPotezu = false;
                        }
                        else
                        {
                            sah = false;
                        }
                    }
                    else if (f.Ime.Contains("Kralj") && f.Boja != bojaOdKralja)
                    {
                        if (p.JedanKorakSviSmjerovi(vratiPoziciju_XY(f.Pozicija)["x"], vratiPoziciju_XY(f.Pozicija)["y"], vratiPoziciju_XY(pozicijaOdKralja)["x"], vratiPoziciju_XY(pozicijaOdKralja)["y"]) == true)
                        {
                            ISPIS = "Sah ";
                            sah = true;
                            break;
                            //bijeliJeNaPotezu = false;
                            //crniJeNaPotezu = false;
                        }
                        else
                        {
                            sah = false;
                        }

                    }
                    else if (f.Ime.Contains("Kralj") && f.Boja != bojaOdKralja)
                    {
                        if (p.JedanKorakSviSmjerovi(vratiPoziciju_XY(f.Pozicija)["x"], vratiPoziciju_XY(f.Pozicija)["y"], vratiPoziciju_XY(pozicijaOdKralja)["x"], vratiPoziciju_XY(pozicijaOdKralja)["y"]) == true)
                        {
                            ISPIS = "Sah ";
                            sah = true;
                            break;

                            //bijeliJeNaPotezu = false;
                            //crniJeNaPotezu = false;
                        }
                        else
                        {
                            sah = false;
                        }

                    }
                    else if (f.Ime.Contains("Lovac") && f.Boja != bojaOdKralja)
                    {
                        if (p.LovacKretanje(vratiPoziciju_XY(f.Pozicija)["x"], vratiPoziciju_XY(f.Pozicija)["y"], vratiPoziciju_XY(pozicijaOdKralja)["x"], vratiPoziciju_XY(pozicijaOdKralja)["y"]) == true)
                        {
                            ISPIS = "Sah ";
                            sah = true;
                            break;
                            //bijeliJeNaPotezu = false;
                            //crniJeNaPotezu = false;
                        }
                        else
                        {
                            sah = false;
                        }

                    }
                    else if (f.Ime.Contains("Top") && f.Boja != bojaOdKralja)
                    {
                        if (p.rookmove(vratiPoziciju_XY(f.Pozicija)["x"], vratiPoziciju_XY(f.Pozicija)["y"], vratiPoziciju_XY(pozicijaOdKralja)["x"], vratiPoziciju_XY(pozicijaOdKralja)["y"]) == true)
                        {
                            ISPIS = "Sah ";
                            sah = true;
                            break;
                            //bijeliJeNaPotezu = false;
                            //crniJeNaPotezu = false;
                        }
                        else
                        {
                            sah = false;
                        }

                    } else
                    {
                        sah = false;
                    }
                }
            }
        }

        private void mouseDown(object sender, MouseEventArgs e)
        {
            //sensing.MouseDown = true;
            sensing.MouseDown = true;            
        }

        private void mouseUp(object sender, MouseEventArgs e)
        {
            string pozicija = vratiPozicijuZaKoordinate(Control.MousePosition.X - this.Location.X - 8, Control.MousePosition.Y - this.Location.Y - 30);
            if(pozicija != "")
            {
                if (vratiFiguruNaPoziciji(pozicija) != null )
                {
                    if (odabranaBoja != vratiFiguruNaPoziciji(pozicija).Boja)
                    {

                        if (odabranaFigura != vratiFiguruNaPoziciji(pozicija) && odabranaFigura != null && odabranaFigura.Boja != vratiFiguruNaPoziciji(pozicija).Boja)
                        {
                            odigrajPotez(pozicija, true);
                        }
                        else
                        {
                            // kada je odabrana figura null
                            if((crniJeNaPotezu && vratiFiguruNaPoziciji(pozicija).Boja == "crna") || (bijeliJeNaPotezu && vratiFiguruNaPoziciji(pozicija).Boja == "bijela"))
                            {
                                odabranaFigura = vratiFiguruNaPoziciji(pozicija);
                                ISPIS = vratiFiguruNaPoziciji(pozicija).Ime;
                                odabranaBoja = vratiFiguruNaPoziciji(pozicija).Boja;
                            }
                        }
                    } else
                    {
                        if ((crniJeNaPotezu && vratiFiguruNaPoziciji(pozicija).Boja == "crna") || (bijeliJeNaPotezu && vratiFiguruNaPoziciji(pozicija).Boja == "bijela"))
                        {
                            odabranaFigura = vratiFiguruNaPoziciji(pozicija);
                            ISPIS = vratiFiguruNaPoziciji(pozicija).Ime;
                            odabranaBoja = vratiFiguruNaPoziciji(pozicija).Boja;
                        }
                    }


            } else if (odabranaFigura != null )
                {
                    if(vratiFiguruNaPoziciji(pozicija) == null )
                    {
                        odigrajPotez(pozicija, false);

                    }
                }
                
            } 
           
            //sensing.MouseDown = false;
            sensing.MouseDown = false;
        }

        private void odigrajPotez(string pozicija, bool napad)
        {
            Potez p = new Potez();
            if (!sah && bijeliJeNaPotezu == true && odabranaFigura.Ime.Contains("Pijun"))
            {
                if ( !napad && p.JedanKorakIgrac1(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                    
                    odabranaFigura = null;
                    bijeliJeNaPotezu = false;
                    crniJeNaPotezu = true;
                }
                else if(p.DvaKorakaIgrac1(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                   
                    odabranaFigura = null;
                    bijeliJeNaPotezu = false;
                    crniJeNaPotezu = true;
                   
                }
                else if (p.PotezZaUbijanjeIgrac1(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;

                    odabranaFigura = null;
                    bijeliJeNaPotezu = false;
                    crniJeNaPotezu = true;
                }

            }
            else if (!sah && crniJeNaPotezu == true && odabranaFigura.Ime.Contains("Pijun"))
            {
                if (!napad && p.JedanKorakIgrac2(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                    
                    odabranaFigura = null;
                    bijeliJeNaPotezu = true;
                    crniJeNaPotezu = false;
                   
                }
                else if(p.DvaKorakaIgrac2(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                   
                    odabranaFigura = null;
                    bijeliJeNaPotezu = true;
                    crniJeNaPotezu = false;
                   
                }
                else if (p.PotezZaUbijanjeIgrac2(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;

                    odabranaFigura = null;
                    bijeliJeNaPotezu = true;
                    crniJeNaPotezu = false;
                }
            }
            else if (!sah && odabranaFigura.Ime.Contains("Konj") && bijeliJeNaPotezu == true)
            {
                if (p.KonjKretanje(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                  
                    odabranaFigura = null;
                    bijeliJeNaPotezu = false;
                    crniJeNaPotezu = true;
                    
                }
            }
            else if (!sah && odabranaFigura.Ime.Contains("Konj") && crniJeNaPotezu == true)
            {
                if (p.KonjKretanje(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                    
                    odabranaFigura = null;
                    bijeliJeNaPotezu = true;
                    crniJeNaPotezu = false;
                   
                }
            }
            else if (!sah && odabranaFigura.Ime.Contains("Kraljica") && bijeliJeNaPotezu == true)
            {
                if (p.KretanjeKraljice(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                    odabranaFigura = null;
                    bijeliJeNaPotezu = false;
                    crniJeNaPotezu = true;
                   
                }
            }
            else if (!sah && odabranaFigura.Ime.Contains("Kraljica") && crniJeNaPotezu == true)
            {
                if (p.KretanjeKraljice(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                    odabranaFigura = null;
                    bijeliJeNaPotezu = true;
                    crniJeNaPotezu = false;
                   
                }
            }
            else if (odabranaFigura.Ime.Contains("Kralj") && bijeliJeNaPotezu == true)
            {
                if (p.JedanKorakSviSmjerovi(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                    
                    odabranaFigura = null;
                    bijeliJeNaPotezu = false;
                    crniJeNaPotezu = true;
                }
            }
            else if (odabranaFigura.Ime.Contains("Kralj") && crniJeNaPotezu == true)
            {
                if (p.JedanKorakSviSmjerovi(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                   
                    odabranaFigura = null;
                    bijeliJeNaPotezu = true;
                    crniJeNaPotezu = false;
                   
                }
            }
            else if (!sah && odabranaFigura.Ime.Contains("Lovac") && bijeliJeNaPotezu == true)
            {
                if (p.LovacKretanje(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                   
                    odabranaFigura = null;
                    bijeliJeNaPotezu = false;
                    crniJeNaPotezu = true;
                   
                }
            }
            else if (!sah && odabranaFigura.Ime.Contains("Lovac") && crniJeNaPotezu == true)
            {
                if (p.LovacKretanje(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                   
                    odabranaFigura = null;
                    bijeliJeNaPotezu = true;
                    crniJeNaPotezu = false;
                   
                }
            }
            else if (!sah && odabranaFigura.Ime.Contains("Top") && bijeliJeNaPotezu == true)
            {
                if (p.rookmove(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                    
                    odabranaFigura = null;
                    bijeliJeNaPotezu = false;
                    crniJeNaPotezu = true;
                   
                }
            }
            else if (!sah && odabranaFigura.Ime.Contains("Top") && crniJeNaPotezu == true)
            {
                if (p.rookmove(vratiPoziciju_XY(odabranaFigura.Pozicija)["x"], vratiPoziciju_XY(odabranaFigura.Pozicija)["y"], vratiPoziciju_XY(pozicija)["x"], vratiPoziciju_XY(pozicija)["y"]) == true)
                {
                    Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                    napadFja(pozicija, napad);
                    odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                    odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                    odabranaFigura.Pozicija = pozicija;
                    
                    odabranaFigura = null;
                    bijeliJeNaPotezu = true;
                    crniJeNaPotezu = false;
                    
                }
            }
            provjeriSahMat(bijeliJeNaPotezu ? "crna" : "bijela");
        }
       
        private void napadFja(string pozicija, bool napad)
        {
            if (napad == true)
            {
                sviPijuni.Find(i => i.X == vratiPoziciju(vratiFiguruNaPoziciji(pozicija).Pozicija)["left"] && i.Y == vratiPoziciju(vratiFiguruNaPoziciji(pozicija).Pozicija)["top"] && i.Show == true).SetVisible(false);

                Figura temp = vratiFiguruNaPoziciji(pozicija);
                temp.Active = false;
                temp.Pozicija = "";
                Sprite odabrani = sviPijuni.Find(i => i.X == vratiPoziciju(odabranaFigura.Pozicija)["left"] && i.Y == vratiPoziciju(odabranaFigura.Pozicija)["top"] && i.Show == true);
                odabrani.SetX(vratiPoziciju(pozicija)["left"]);
                odabrani.SetY(vratiPoziciju(pozicija)["top"]);
                odabranaFigura.Pozicija = pozicija;
                
                odabranaBoja = vratiFiguruNaPoziciji(pozicija).Boja;/* == "bijela" ? "crna" : "bijela";*/

                //crniJeNaPotezu = odabranaBoja == "crna" ? false : true;
                //bijeliJeNaPotezu = odabranaBoja == "bijela" ? false : true;
            }
        }
        private void mouseMove(object sender, MouseEventArgs e)
        {
            mouseX = e.X;
            mouseY = e.Y;

            //sensing.MouseX = e.X;
            //sensing.MouseY = e.Y;
            //Sensing.Mouse.x = e.X;
            //Sensing.Mouse.y = e.Y;
            sensing.Mouse.X = e.X;
            sensing.Mouse.Y = e.Y;

        }

        private void keyDown(object sender, KeyEventArgs e)
        {
            sensing.Key = e.KeyCode.ToString();
            sensing.KeyPressedTest = true;
        }

        private void keyUp(object sender, KeyEventArgs e)
        {
            sensing.Key = "";
            sensing.KeyPressedTest = false;
        }

        private void Update(object sender, EventArgs e)
        {
            if (sensing.KeyPressed(Keys.Escape))
            {
                START = false;
            }

            if (START)
            {
                this.Refresh();
            }
        }

        #endregion
        /* ------------------- */
        #region Start of Game Methods

        //my
        #region my

        //private void StartScriptAndWait(Func<int> scriptName)
        //{
        //    Task t = Task.Factory.StartNew(scriptName);
        //    t.Wait();
        //}

        //private void StartScript(Func<int> scriptName)
        //{
        //    Task t;
        //    t = Task.Factory.StartNew(scriptName);
        //}

        private int AnimateBackground(int intervalMS)
        {
            while (START)
            {
                setBackgroundPicture(backgroundImages[backgroundImageIndex]);
                Game.WaitMS(intervalMS);
                backgroundImageIndex++;
                if (backgroundImageIndex == 3)
                    backgroundImageIndex = 0;
            }
            return 0;
        }

        private void KlikNaZastavicu()
        {
            foreach (Func<int> f in GreenFlagScripts)
            {
                Task.Factory.StartNew(f);
            }
        }

        #endregion

        /// <summary>
        /// BGL
        /// </summary>
        public BGL()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Pričekaj (pauza) u sekundama.
        /// </summary>
        /// <example>Pričekaj pola sekunde: <code>Wait(0.5);</code></example>
        /// <param name="sekunde">Realan broj.</param>
        public void Wait(double sekunde)
        {
            int ms = (int)(sekunde * 1000);
            Thread.Sleep(ms);
        }

        //private int SlucajanBroj(int min, int max)
        //{
        //    Random r = new Random();
        //    int br = r.Next(min, max + 1);
        //    return br;
        //}

        /// <summary>
        /// -
        /// </summary>
        public void Init()
        {
            if (dt == null) time = dt.TimeOfDay.ToString();
            loopcount++;
            //Load resources and level here
            this.Paint += new PaintEventHandler(DrawTextOnScreen);
            SetupGame();
        }

        /// <summary>
        /// -
        /// </summary>
        /// <param name="val">-</param>
        public void showSyncRate(bool val)
        {
            showSync = val;
            if (val == true) syncRate.Show();
            if (val == false) syncRate.Hide();
        }

        /// <summary>
        /// -
        /// </summary>
        public void updateSyncRate()
        {
            if (showSync == true)
            {
                thisTime = (DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0)).TotalSeconds;
                diff = thisTime - lastTime;
                lastTime = (DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0)).TotalSeconds;

                double fr = (1000 / diff) / 1000;

                int fr2 = Convert.ToInt32(fr);

                syncRate.Text = fr2.ToString();
            }

        }

        //stage
        #region Stage

        /// <summary>
        /// Postavi naslov pozornice.
        /// </summary>
        /// <param name="title">tekst koji će se ispisati na vrhu (naslovnoj traci).</param>
        public void SetStageTitle(string title)
        {
            this.Text = title;
        }

        /// <summary>
        /// Postavi boju pozadine.
        /// </summary>
        /// <param name="r">r</param>
        /// <param name="g">g</param>
        /// <param name="b">b</param>
        public void setBackgroundColor(int r, int g, int b)
        {
            this.BackColor = Color.FromArgb(r, g, b);
        }

        /// <summary>
        /// Postavi boju pozornice. <c>Color</c> je ugrađeni tip.
        /// </summary>
        /// <param name="color"></param>
        public void setBackgroundColor(Color color)
        {
            this.BackColor = color;
        }

        /// <summary>
        /// Postavi sliku pozornice.
        /// </summary>
        /// <param name="backgroundImage">Naziv (putanja) slike.</param>
        public void setBackgroundPicture(string backgroundImage)
        {
            this.BackgroundImage = new Bitmap(backgroundImage);
        }

        /// <summary>
        /// Izgled slike.
        /// </summary>
        /// <param name="layout">none, tile, stretch, center, zoom</param>
        public void setPictureLayout(string layout)
        {
            if (layout.ToLower() == "none") this.BackgroundImageLayout = ImageLayout.None;
            if (layout.ToLower() == "tile") this.BackgroundImageLayout = ImageLayout.Tile;
            if (layout.ToLower() == "stretch") this.BackgroundImageLayout = ImageLayout.Stretch;
            if (layout.ToLower() == "center") this.BackgroundImageLayout = ImageLayout.Center;
            if (layout.ToLower() == "zoom") this.BackgroundImageLayout = ImageLayout.Zoom;
        }

        #endregion

        //sound
        #region sound methods

        /// <summary>
        /// Učitaj zvuk.
        /// </summary>
        /// <param name="soundNum">-</param>
        /// <param name="file">-</param>
        public void loadSound(int soundNum, string file)
        {
            soundCount++;
            sounds[soundNum] = new SoundPlayer(file);
        }

        /// <summary>
        /// Sviraj zvuk.
        /// </summary>
        /// <param name="soundNum">-</param>
        public void playSound(int soundNum)
        {
            sounds[soundNum].Play();
        }

        /// <summary>
        /// loopSound
        /// </summary>
        /// <param name="soundNum">-</param>
        public void loopSound(int soundNum)
        {
            sounds[soundNum].PlayLooping();
        }

        /// <summary>
        /// Zaustavi zvuk.
        /// </summary>
        /// <param name="soundNum">broj</param>
        public void stopSound(int soundNum)
        {
            sounds[soundNum].Stop();
        }

        #endregion

        //file
        #region file methods

        /// <summary>
        /// Otvori datoteku za čitanje.
        /// </summary>
        /// <param name="fileName">naziv datoteke</param>
        /// <param name="fileNum">broj</param>
        public void openFileToRead(string fileName, int fileNum)
        {
            readFiles[fileNum] = new StreamReader(fileName);
        }

        /// <summary>
        /// Zatvori datoteku.
        /// </summary>
        /// <param name="fileNum">broj</param>
        public void closeFileToRead(int fileNum)
        {
            readFiles[fileNum].Close();
        }

        /// <summary>
        /// Otvori datoteku za pisanje.
        /// </summary>
        /// <param name="fileName">naziv datoteke</param>
        /// <param name="fileNum">broj</param>
        public void openFileToWrite(string fileName, int fileNum)
        {
            writeFiles[fileNum] = new StreamWriter(fileName);
        }

        /// <summary>
        /// Zatvori datoteku.
        /// </summary>
        /// <param name="fileNum">broj</param>
        public void closeFileToWrite(int fileNum)
        {
            writeFiles[fileNum].Close();
        }

        /// <summary>
        /// Zapiši liniju u datoteku.
        /// </summary>
        /// <param name="fileNum">broj datoteke</param>
        /// <param name="line">linija</param>
        public void writeLine(int fileNum, string line)
        {
            writeFiles[fileNum].WriteLine(line);
        }

        /// <summary>
        /// Pročitaj liniju iz datoteke.
        /// </summary>
        /// <param name="fileNum">broj datoteke</param>
        /// <returns>vraća pročitanu liniju</returns>
        public string readLine(int fileNum)
        {
            return readFiles[fileNum].ReadLine();
        }

        /// <summary>
        /// Čita sadržaj datoteke.
        /// </summary>
        /// <param name="fileNum">broj datoteke</param>
        /// <returns>vraća sadržaj</returns>
        public string readFile(int fileNum)
        {
            return readFiles[fileNum].ReadToEnd();
        }

        #endregion

        //mouse & keys
        #region mouse methods

        /// <summary>
        /// Sakrij strelicu miša.
        /// </summary>
        public void hideMouse()
        {
            Cursor.Hide();
        }

        /// <summary>
        /// Pokaži strelicu miša.
        /// </summary>
        public void showMouse()
        {
            Cursor.Show();
        }

        /// <summary>
        /// Provjerava je li miš pritisnut.
        /// </summary>
        /// <returns>true/false</returns>
        public bool isMousePressed()
        {
            //return sensing.MouseDown;
            return sensing.MouseDown;
        }

        /// <summary>
        /// Provjerava je li tipka pritisnuta.
        /// </summary>
        /// <param name="key">naziv tipke</param>
        /// <returns></returns>
        public bool isKeyPressed(string key)
        {
            if (sensing.Key == key)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Provjerava je li tipka pritisnuta.
        /// </summary>
        /// <param name="key">tipka</param>
        /// <returns>true/false</returns>
        public bool isKeyPressed(Keys key)
        {
            if (sensing.Key == key.ToString())
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        #endregion

        #endregion
        /* ------------------- */

        /* ------------ GAME CODE START ------------ */

        /* Game variables */


        /* Initialization */
        string odabranaBoja = "";
        bool bijeliJeNaPotezu = true;
        bool crniJeNaPotezu = false;
        //Sprite bord;
        //Sprite kraljBili;
        //Sprite kraljCrni;
        //Sprite kraljicaCrni;
        //Sprite kraljicaBili;

        List<Sprite> sviPijuni = new List<Sprite>();
        Ploča ploca = new Ploča();
       
        Figura[] pijuniCrni = new Figura().kreirajPijune("crna");
        Figura[] pijuniBili = new Figura().kreirajPijune("bijela");

        Figura[] topoviCrni = new Figura().kreirajTopove("crna");
        Figura[] topoviBili = new Figura().kreirajTopove("bijela");

        Figura[] konjiCrni = new Figura().kreirajKonje("crna");
        Figura[] konjiBili = new Figura().kreirajKonje("bijela");

        Figura[] lovciCrni = new Figura().kreirajLovca("crna");
        Figura[] lovciBili = new Figura().kreirajLovca("bijela");

        Figura[] kraljbili = new Figura().kreirajKraljeve("crna");
        Figura[] kraljcrni = new Figura().kreirajKraljeve("bijela");

        Figura[] kraljicacrna = new Figura().kreirajKraljice("crna");
        Figura[] kraljicabila = new Figura().kreirajKraljice("bijela");

        Figura[] figure = new Figura[32];

        Figura odabranaFigura;

        bool sah = false;
        private void keyPress(object sender, KeyPressEventArgs e)
        {
            sensing.KeyPressedTest = true;
            sensing.Key = ((char)e.KeyChar).ToString();
            //ISPIS = sensing.Key.ToString();
            if(sensing.Key.ToString()=="r")
            {
                BGL.allSprites.Clear();
                
                sviPijuni = new List<Sprite>();
                ploca = new Ploča();

                pijuniCrni = new Figura().kreirajPijune("crna");
                pijuniBili = new Figura().kreirajPijune("bijela");

                topoviCrni = new Figura().kreirajTopove("crna");
                topoviBili = new Figura().kreirajTopove("bijela");

                konjiCrni = new Figura().kreirajKonje("crna");
                konjiBili = new Figura().kreirajKonje("bijela");

                lovciCrni = new Figura().kreirajLovca("crna");
                lovciBili = new Figura().kreirajLovca("bijela");

                kraljbili = new Figura().kreirajKraljeve("crna");
                kraljcrni = new Figura().kreirajKraljeve("bijela");

                kraljicacrna = new Figura().kreirajKraljice("crna");
                kraljicabila = new Figura().kreirajKraljice("bijela");

                figure = new Figura[32];

                odabranaFigura = null;

                bijeliJeNaPotezu = true;
                crniJeNaPotezu = false;
                SetupGame();


            }
        }

        public Figura vratiFiguruNaPoziciji(string pozicija)
        {
            for (int i = 0; i < 32; i++) {
                if(figure[i].Pozicija == pozicija && figure[i].Active == true)
                {
                    return figure[i];
                }
            }
            return null;
        }

        public Dictionary<string, int> vratiPoziciju(string imePozicije)
        {

            Dictionary<string, int> pozicija = new Dictionary<string, int>();
            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    string ime = ploca.Ploca[i, j].Ime;
                    if (ime == imePozicije)
                    {

                        pozicija.Add("left", ploca.Ploca[i, j].Left);
                        pozicija.Add("top", ploca.Ploca[i, j].Top);
                      
                    }

                }
            }

            return pozicija;
        }

        public Dictionary<string, int> vratiPoziciju_XY(string imePozicije)
        {

            Dictionary<string, int> pozicija = new Dictionary<string, int>();
            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    string ime = ploca.Ploca[i, j].Ime;
                    if (ime == imePozicije)
                    {

                        pozicija.Add("x", ploca.Ploca[i, j].Pozicija_x);
                        pozicija.Add("y", ploca.Ploca[i, j].Pozicija_y);

                    }

                }
            }

            return pozicija;
        }



        public string vratiPozicijuZaKoordinate(int x, int y)
        {
            string pozicija = "";
            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    int x_next = ploca.Ploca[i, j].Left+75;

                    if (x >= ploca.Ploca[i, j].Left && x < x_next && y >= ploca.Ploca[i, j].Top)
                    {
                            for(int z = 0; z < 8; z++)
                            {
                            int y_next = ploca.Ploca[i, j].Top + 50;
                            if (y >= ploca.Ploca[i,z].Top && y < y_next)
                            {
                                
                                pozicija = ploca.Ploca[i, z].Ime;
                            }
                            }
                        
                    }
                }
                

            }

            return pozicija;
        }

        private void SetupGame()
        {
           

          
            //1. setup stage
            SetStageTitle("CHESS");
            //setBackgroundColor(Color.WhiteSmoke);            
            setBackgroundPicture("backgrounds\\back.jpg");
            //none, tile, stretch, center, zoom
            setPictureLayout("stretch");

           
            //2. add sprites
            Sprite bord = new Sprite("sprites\\Bord.png",50, 50);
            Game.AddSprite(bord);
            int counter = 0;
            for (int i = 0; i < 8; i++)
            {
                Sprite pijunCrni = new Sprite(pijuniCrni[i].Slika, vratiPoziciju(pijuniCrni[i].Pozicija)["left"], vratiPoziciju(pijuniCrni[i].Pozicija)["top"]);
                Game.AddSprite(pijunCrni);
                sviPijuni.Add(pijunCrni);

                Sprite pijunBili = new Sprite(pijuniBili[i].Slika, vratiPoziciju(pijuniBili[i].Pozicija)["left"], vratiPoziciju(pijuniBili[i].Pozicija)["top"]);
                Game.AddSprite(pijunBili);
                sviPijuni.Add(pijunBili);

                figure[counter] = pijuniCrni[i];
                counter++;
                figure[counter] = pijuniBili[i];
                counter++;

             
            }

            for (int i = 0; i < 2; i++)
            {
                Sprite topCrni = new Sprite(topoviCrni[i].Slika, vratiPoziciju(topoviCrni[i].Pozicija)["left"], vratiPoziciju(topoviCrni[i].Pozicija)["top"]);
                Game.AddSprite(topCrni);
                sviPijuni.Add(topCrni);

                Sprite topBili = new Sprite(topoviBili[i].Slika, vratiPoziciju(topoviBili[i].Pozicija)["left"], vratiPoziciju(topoviBili[i].Pozicija)["top"]);
                Game.AddSprite(topBili);
                sviPijuni.Add(topBili);

                figure[counter] = topoviCrni[i];
                counter++;
                figure[counter] = topoviBili[i];
                counter++;
            }

            for (int i = 0; i < 2; i++)
            {
                Sprite konjCrni = new Sprite(konjiCrni[i].Slika, vratiPoziciju(konjiCrni[i].Pozicija)["left"], vratiPoziciju(konjiCrni[i].Pozicija)["top"]);
                Game.AddSprite(konjCrni);
                sviPijuni.Add(konjCrni);

                Sprite konjBili = new Sprite(konjiBili[i].Slika, vratiPoziciju(konjiBili[i].Pozicija)["left"], vratiPoziciju(konjiBili[i].Pozicija)["top"]);
                Game.AddSprite(konjBili);
                sviPijuni.Add(konjBili);

                figure[counter] = konjiCrni[i];
                counter++;
                figure[counter] = konjiBili[i];
                counter++;
            }
            for (int i = 0; i < 2; i++)
            {
                Sprite lovacCrni = new Sprite(lovciCrni[i].Slika, vratiPoziciju(lovciCrni[i].Pozicija)["left"], vratiPoziciju(lovciCrni[i].Pozicija)["top"]);
                Game.AddSprite(lovacCrni);
                sviPijuni.Add(lovacCrni);

                Sprite lovacBili = new Sprite(lovciBili[i].Slika, vratiPoziciju(lovciBili[i].Pozicija)["left"], vratiPoziciju(lovciBili[i].Pozicija)["top"]);
                Game.AddSprite(lovacBili);
                sviPijuni.Add(lovacBili);

                figure[counter] = lovciCrni[i];
                counter++;
                figure[counter] = lovciBili[i];
                counter++;
            }

            for (int i = 0; i < 1; i++)
            {
                Sprite kraljiCacrnaFigura = new Sprite(kraljicacrna[i].Slika, vratiPoziciju(kraljicacrna[i].Pozicija)["left"], vratiPoziciju(kraljicacrna[i].Pozicija)["top"]);
                Game.AddSprite(kraljiCacrnaFigura);
                sviPijuni.Add(kraljiCacrnaFigura);

                Sprite kraljicaBilaFiruga = new Sprite(kraljicabila[i].Slika, vratiPoziciju(kraljicabila[i].Pozicija)["left"], vratiPoziciju(kraljicabila[i].Pozicija)["top"]);
                Game.AddSprite(kraljicaBilaFiruga);
                sviPijuni.Add(kraljicaBilaFiruga);

                figure[counter] = kraljicacrna[i];
                counter++;
                figure[counter] = kraljicabila[i];
                counter++;
            }

            for (int i = 0; i < 1; i++)
            {
                Sprite kraljCacrnaFigura = new Sprite(kraljcrni[i].Slika, vratiPoziciju(kraljcrni[i].Pozicija)["left"], vratiPoziciju(kraljcrni[i].Pozicija)["top"]);
                Game.AddSprite(kraljCacrnaFigura);
                sviPijuni.Add(kraljCacrnaFigura);

                Sprite kraljcaBilaFiruga = new Sprite(kraljbili[i].Slika, vratiPoziciju(kraljbili[i].Pozicija)["left"], vratiPoziciju(kraljbili[i].Pozicija)["top"]);
                Game.AddSprite(kraljcaBilaFiruga);
                sviPijuni.Add(kraljcaBilaFiruga);

                figure[counter] = kraljbili[i];
                counter++;
                figure[counter] = kraljcrni[i];
                counter++;
            }
            


          

            

            //3. scripts that start
        }

        /* Scripts */

        private int Metoda()
        {
            while (START) //ili neki drugi uvjet
            {
               
                Wait(0.1);
              
              
            }
            return 0;
        }



        /* ------------ GAME CODE END ------------ */


    }
}
