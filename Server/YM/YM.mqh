//+------------------------------------------------------------------+
//|                                   Copyright 2022, Yousuf Mesalm. |
//|                                    https://www.Yousuf-mesalm.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2022, Yousuf Mesalm."
#property link      "https://www.Yousuf-mesalm.com"
#property link      "https://www.mql5.com/en/users/20163440"
#property description      "Developed by Yousuf Mesalm"
#property description      "https://www.Yousuf-mesalm.com"
#property description      "https://www.mql5.com/en/users/20163440"
#property version   "1.00"

#define Link1  "https://www.upwork.com/freelancers/~0148d869d9334a576e"
#define Link2  "https://www.mql5.com/en/job/new?prefered=20163440"
#define Link3  "https://www.Yousuf-mesalm.com"

/*
MIT License

Copyright (c) 2019 - 2021 Dionisis Nikolopoulos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/




#include "Execute/Execute.mqh"
#include "Position/Position.mqh"
#include "Order/Order.mqh"
#include "HistoryPosition/HistoryPosition.mqh"
#include "HistoryOrder/HistoryOrder.mqh"


//+------------------------------------------------------------------+
//|              search for Position per comment                                             |
//+------------------------------------------------------------------+
bool Search_By_Comment(CPosition & pos,string comment)
  {
   bool res=false;
   for(int i=0; i<pos.GroupTotal(); i++)
     {
      if(pos[i].GetComment()==comment)
         res=true;
     }
   return res;
  }

//+------------------------------------------------------------------+
//|              search for order per comment                                             |
//+------------------------------------------------------------------+
bool Search_By_Comment(COrder & pos,string comment)
  {
   bool res=false;
   for(int i=0; i<pos.GroupTotal(); i++)
     {
      if(pos[i].GetComment()==comment)
         res=true;
     }
   return res;
  }


//+------------------------------------------------------------------+


//+------------------------------------------------------------------+
//| HexToArray                                                       |
//+------------------------------------------------------------------+
bool HexToArray(string str, uchar &arr[])
  {
//--- By Andrew Sumner & Alain Verleyen
//--- https://www.mql5.com/en/forum/157839/page3
#define HEXCHAR_TO_DECCHAR(h) (h<=57?(h-48):(h-55))
//---
   int strcount = StringLen(str);
   int arrcount = ArraySize(arr);
   if(arrcount < strcount / 2)
      return false;
//---
   uchar tc[];
   StringToCharArray(str, tc);
//---
   int i = 0,
       j = 0;
//---
   for(i = 0; i < strcount; i += 2)
     {
      //---
      uchar tmpchr = (HEXCHAR_TO_DECCHAR(tc[i])<<4)+HEXCHAR_TO_DECCHAR(tc[i+1]);
      //---
      arr[j] = tmpchr;
      j++;
     }
//---
   return(true);
  }
//+------------------------------------------------------------------+
//| dString                                                          |
//+------------------------------------------------------------------+
string dString(string text)
  {
//---
   uchar in[],
         out[],
         key[];
//---
   StringToCharArray("H+#eF_He", key);
//---
   StringToCharArray(text, in, 0, StringLen(text));
//---
   HexToArray(text, in);
//---
   CryptDecode(CRYPT_DES, in, key, out);
//---
   string result = CharArrayToString(out);
//---
   return(result);
  }

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
bool isExpired(datetime date)
  {
   if(date > 0)
     {
      if(TimeCurrent() > date)
        {
         double pVal = TerminalInfoInteger(TERMINAL_PING_LAST);
         Alert(
            //---
            dString("99A6D43B833CB976021189ABAEEACF5D")+AccountInfoString(ACCOUNT_NAME));
         Alert(dString("47D4F60E4272BE70FB300EB05BD2AEC9")+IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN)));
         Alert(
            dString("83744D48C2D63F90DD2F812DBB5CFC0C")+IntegerToString(AccountInfoInteger(ACCOUNT_LEVERAGE)));
         Alert(
            //---
            dString("B001C36F24DDD87AFB300EB05BD2AEC9")+AccountInfoString(ACCOUNT_COMPANY));
         Alert(
            dString("808FEF727352434E021189ABAEEACF5D")+AccountInfoString(ACCOUNT_SERVER));
         Alert(
            dString("70FA849373E41928")+DoubleToString(pVal/1000, 2)+dString("CDB9155CB6080FC4")
         );
         //---
         Alert(
            dString("47EFF8FADDDA4F05FB300EB05BD2AEC9")+dString("97BA10D5D76C54AE"));
         Alert(
            "Your license is Expired , Please contact the developer ");
         Alert(
            "dr.yousuf.mesalm@gmail.com ");
         Alert(
            "Author: "+"Dr YouSuf MeSalm ");
         Alert(
            "www.Yousuf-Mesalm.com");
         Alert(
            "https://www.freelancer.com/u/usofmslam");
         Alert(
            "https://www.mql5.com/en/job/new?prefered=20163440");
         Alert(
            "https://www.upwork.com/freelancers/~0148d869d9334a576e");
         //---, MB_CAPTION, MB_ICONINFORMATION|MB_OK


         return true;
        }
     }
   return false;
  }
//+------------------------------------------------------------------+

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void Message()
  {
   double pVal = TerminalInfoInteger(TERMINAL_PING_LAST);

   MessageBox
   (
//---
      dString("99A6D43B833CB976021189ABAEEACF5D")+AccountInfoString(ACCOUNT_NAME)
      +"\n"+
      dString("47D4F60E4272BE70FB300EB05BD2AEC9")+IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN))
      +"\n"+
      dString("83744D48C2D63F90DD2F812DBB5CFC0C")+IntegerToString(AccountInfoInteger(ACCOUNT_LEVERAGE))
      +"\n\n"+
//---
      dString("B001C36F24DDD87AFB300EB05BD2AEC9")+AccountInfoString(ACCOUNT_COMPANY)
      +"\n"+
      dString("808FEF727352434E021189ABAEEACF5D")+AccountInfoString(ACCOUNT_SERVER)
      +"\n"+
      dString("70FA849373E41928")+DoubleToString(pVal/1000, 2)+dString("CDB9155CB6080FC4")
      +"\n\n"+
//---
      dString("47EFF8FADDDA4F05FB300EB05BD2AEC9")+dString("97BA10D5D76C54AE")
      +"\n\n"+
      "Owner: "+"Tim Hutter "
      +"\n\n"+
      "www.fxcrusher.com "
      +"\n\n"+
      "Developer: "+"Yousuf Mesalm"
      +"\n\n"+
      "www.Yousuf-Mesalm.com"
      +"\n\n"+
      Link1
      +"\n\n"+
      Link2
      +"\n\n"+
      Link3
//---, MB_CAPTION, MB_ICONINFORMATION|MB_OK
   );
  }
//+------------------------------------------------------------------+
