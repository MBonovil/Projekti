using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OTTER
{
    class Polje
    {
        private string ime;
        private int pozicija_x;
        private int pozicija_y;
        private int left;
        private int top;
        public Polje()
        {

        }
        public Polje(string _ime, int _x, int _y, int _left, int _top)
        {
            Ime = _ime;
            Pozicija_x = _x;
            Pozicija_y = _y;
            Top = _top;
            Left = _left;
        }

        public string Ime { get => ime; set => ime = value; }
        public int Pozicija_x { get => pozicija_x; set => pozicija_x = value; }
        public int Pozicija_y { get => pozicija_y; set => pozicija_y = value; }
        public int Left { get => left; set => left = value; }
        public int Top { get => top; set => top = value; }
    }
}
