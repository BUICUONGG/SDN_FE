import React, { useEffect, useState } from "react";
import "./PaymentTest.css";
import { appService } from "../../service/appService";
import {
  calculateShippingFee,
  getDistricts,
  getProvinces,
  getWards,
} from "../../service/ghnService";
import { orderService } from "../../service/orderService";
import { Modal } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";

const bankList = [
  {
    id: "bidv",
    name: "BIDV",
    logo: "data:image/png;base64,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",
  },
  {
    id: "mb",
    name: "MB",
    logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA5FBMVEX///8cR4ziLUDa3eoAMYL8//8APocAPIeXn8H+//0YRYsOQoqstc7//v8WRItxgrAAOYYAN4biKD3gGjKPncDhDy3iIznhHjb42dnhFzD78/HiP0zo6u7kJjxIYZzhECryxsj19vhPZpjtkZXndHrvsbLvqKv86urun6EALoDGzdyiqsZzha6Ckrbyw8P30tLqhYrkSFX43t/maXHlWGHurqrtmp5ddaY8WpctTo7pgYTc3+gAJn3lXWfCyNvkQ01rfKXdAB/98vRqeaxXcKV9j7Gqss1CYJYvU5HpcnVddqLnd3/9HcTtAAALL0lEQVR4nO2cCXfaPBaGjUE4toMDNraxISwF4qzsBZKUTBemSZv//39GthYvbI7zZTLJ3OecnlOQ4+rVle4iKRUEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4P8Qb1j7id67E2+IPLJMs95/7268GSXUM0RR1J3PK3HQEn30sSu/d1feBNkVKc7kvfvyNqCuTRUan1ThxGI2rLvv3Ze3oISmTKFz/injBRoYVKD9/Dn9jCvqRKA1e++uvBEj6mZOP+cixG7GJAJ10fuUi1AQZmSO6qdD4aOuwhL+s9M6qN+ikbAvyOltKO/4+7Yv5W1f/rN4X88HOzovy3ViQnMuIG/U66N0vegccY63PnBZZe3VPP+ycXNzfbJYLJrN5fL2NpfL3d4u1yfV48vGizVFQfOWbZv1HYuM5mvGHUITw9bNu3R2vC9IRYJUud/SXlqWaXuxcMS/zX8rFlWMpmiaQtA0Fb/iIuePQ1YTk2lobXeUSBif+oFwhWR05/tUx0v10odyjqFeb2uvbGvPF3K7kAqL/Jb3pEGuUyt1A0Vy/24+9ASEmK0GLVt3xi7+uPK1msNUb/0thZ0rbzFiU+XNyjqNQjwSlWopkxW9Fo3nDp6nSP5jWoYjzu76NWbT4fN0/tMfirH/YMoK8SaiULrZmF+XBYU3a8tSKoU5pbzoZJmpLvWVor7y5Tjk75Zh11fzthdxsu6/fIX2Waq3XhcjXas0kv1aa2Grdsv9yH6FeKy+CyXh5cxYWt0a4DnJUlCsUrexzF7fJfFE8Ehq2k310oUa7Vg10ZovK5Fmlc/iQwpzhe2O+QBDJkoXXTSxxRi65Zht8hxpsu7SvLOz1GId68Sb/0b158rchUQV+l5UxS41plDLdZL/VBq+8tIB2+fMTmgUdVr11oIJrE/TRMRGLtaz4lVs/eSlWLcrD5sKldzT8gvm8SlXKUbeVb7KIFBGXS6xhk3VrTt6TKJNzDYgCsdp3tkoxzSot7Ghjy3SnCL93lSo/up0/EFBnUa+ehuOiPolg0L8mh6rHlYyfq3bH8c0Bi4IW5eOQxpvlq/kYoQifPmJqVfkyzSi8CT6Aws+JMptpvQGyczb0FiAhquWlVQ4J8NgpPFmD3Eb5rRmJBWqluMKw5C/Q2EpsqzVbRlSCtz6KVXjUgHeyHKoQmfu/yvCHdFspklqjhMK/bXGRqaTaMqp3w8oFIQrNk+VYjaFJeTROt4Y0cFGgns2toMIOCaxv0dT8GGKzPSomFChrPnkvpISbRpv26kwnBNa5iS8TWelGS1rBlPbtKZuIKlE60RjEOjfXW/5VCUlIaNySd8p3yabtCXzQzsV8jmhPGUKFwF94kh+yKQfQpDKy16NTcrOmCi0/aU6GU27wz3T9Tppw7DLD5VkU+g9dirkCYS6yCwQexJ/3el13zZoi4HYtrd9jkOjbuGER5yNBt52W67VpAycupGmJ22jSTqk8IpP0vKD8Ap6pm20agi5Z6PzTft41PFYIyRPT2nCE6R1m9vg8iOTofDQX/Tzbxnn3HxybojfrhBdLvicV5uvESigdvfMQ6j/w7bs1teEbZBn8cTnZz2a1tmmPU1sEZTClIb7eYWkbjy0aU2+INkajWZtqrJsrn+t18vcRYVPCK3yumKfUPtBQkQ73mmZ7Ui12tzpcKzWnRwJk6UOX2vlSz7+kp9w3XNHWnng4nnaFsu8cVKqBYkpHy2teCn8A8zIDLR68VJMxhl6UB/ivBQNzIREsdWPDEipc8E6VWjcMKMpt4LvZPmnUpMpLLOK4UB9uMxnKp7ioD6L8+NkdoaG45Zpj/zgKA9mrdOYwtNZ1OT33IYXKB+xp9BhM1PBFdU6Zt3DCrWnTLVTApctMX1jB78klDxc+PtKZISGvZYdNeRpdEAuQ4WCHPX0YVzT7oUT1sDrxwM21CqL7NGQiQgPCg9VusibiwY3pD6O2pDHPKUcy0fu12yS+rkon7/Sv1MpxBS/vHKayjWWb5+OU5xR4MlqU0Oasc2NY77acn41zGajxudlTsJVb5Up5KHhoEJ/z+dV8INCXTyQX7veoOYnPrWRaOi6bk5jqzZMlJfRT2EI1B7x90fcoOvShkJFkso+lXJRi5bT0uvc6YCXE8PtuUrwpTc8740Nx+wFqryzVX123ok9fxUGPfypoSQz0Zx0LEcsrT2ipEJlWT06fsAcX90spEiGpC5esfVfYjv4ojnY+gDux6Q/momGbfkPml/Jt/LG/Qy+wrRgL/Q6mcMpkm807nZ46r2rAr6O5LLbdl9TQ2vcxKIi4IxreDYVbSyOuVC6KbVl7Z/wFfYr6HiyXiJV/TH3R9p+hdHENAwtGfDYKdN82wzt4mCoxwK9s9Pd8sQ7KN+R0IxPU+UiSL5CJ1s+pFAO98jDevnlUDdjPxOBKGadniMmMOo7vRHPx4rE9cUrJoVYNqKwcEhhuGZzSjPzQmwTDdaKvqH9vHrm65FmqxzdqHe9nTkUz6npJpMcLxcLl8FP8mxHKdwfUnjJR0O5zRr1EUlIdRoIURdPSssc0dbz2C6q5Yz77p4qn3eHLZpqVKLWJCOT54+x4iKVQiWrQrJTo4s00g/I6b3Z31RomdN2ae8mBk+8qUK5EZ2mbFc3v1HXcoVKUuFNZD8xq8LgaEm3WTlL951EnSgesPMb0XBGB28sXPD8mjm+k2jAoEVeo7BTYXK3IhJSYxuTL2PgGIbNTwdZCWjRzbd64IYso352OJ3jXQ+3s8NcnHkf/Bj/jg3ELoWNx3CAth64pmQyP/fYLg36wwKDSazqzUzbtleDNI7snndUYvVOJ3T3EjuI6Wws1+iuPn+b3Ph9GzlPzXRyQUGBttKkP3ARW4f+jjcxYqk9P68JqQ7Tw5IwPHThMTty8sAVFo+SCpWn6+ubgOu1Vo5sXimvyWmQ4A7PemPbcMQhknvsuMZ48b3gcEryHZjwNEoKy1j+GJu40cxbJfcY1GL8lINn6S/n5/B8JdpGkLbouhxuxuh1NwhfuJQYDrw0NnzYCAOY6wq5mqGGrjDcQrveULgDpZyptkDyoDs2zEjNbtb8cp9+NrrBkSFyx6ZjnqXwZOGpRSW8P3FfJUQ2PMNM7CStwmI2PzOpm1Z8a6nlrziPB0DibKYGa0mtsLD3hgiv+5jnPFzjrzMFQ3dsiXEscgxaM4hu64/ABdvzwy8Mr5oU9roFvv2tNVMpVMrZBAr9RFJtOTOaU7N7C+YAz1PvNBof98GL99zF3h6F2xvLNAol6Shb0o2eYya0zF5bZjl136TOBruZiUHseVChHKZY+xXyDdNgK3W/QrVcvrnPWlWMwpxTN5zokUUJzYl9nXN+U2F18H3ySUGifNurcF1hzxWowm9lCccHVVIVRcN/FFVVpaJULl9IJ8fZNxJRmwV325gN4geDsnBHJmorvKlwOB5dHjN+7zX4Q/gcsU7j6qp6c/33799F8/GxuVwum83F95srcjfxFfszcuAkdUO82/STsjwNLNxyhTNq6tdvrP/36Yysljk+84TNqzIyrjksfyEKQpcsV+NjXvb2JpNdF4BxoG+ZOq45RvSmwsdUuO3Ql+JvsvmpuEBdrvlJfy8IMyXh32m/d0feCNRhdzE+7a8gsnM3I90F0w+IS3Nz/y7G58SjOWq6C6YfEY8GfCvdJeEPCFqRaNFqv3dP3oya7Us0e5/017t8hjPbqXdLH/b3u1KAvMmn/l8VCJ/YgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+L/AfP7emcnF8VDQAAAABJRU5ErkJggg==",
  },
  {
    id: "acb",
    name: "ACB",
    logo: "data:image/png;base64,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",
  },
  {
    id: "vietcombank",
    name: "Vietcombank",
    logo: "data:image/png;base64,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",
  },
  {
    id: "vietinbank",
    name: "VietinBank",
    logo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxINEhANDRMQDQ4NGBENDQ0NERIOEA0OFR0iFhURFxUZKCggGBslGxUTITQhJiktLi4uFx81ODMsNygtLisBCgoKDg0OGxAQGy4mICMzMDMtMC01LzIrLS0vMTUtLzIvLy8uLSstLy0rLS0tLS0tLS0tNS0vLTUtLS8tLS0tLf/AABEIALMBGgMBEQACEQEDEQH/xAAcAAEBAQADAQEBAAAAAAAAAAABAgAEBgcFCAP/xABKEAABAgMGBAMFAgcNCQAAAAABAAIDESEEEjFBYZEFUXGhBgcTIoHB0fAUMhUjJUJSdLIkMzQ1U2Jyc4KTsdLhJkNUY5KzwsPx/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAIDBAUBBv/EADMRAQACAQICBwYFBQEAAAAAAAABAgMEERIhEyIxM0FRcQUUMjSBkSNhsdHwBhWhweFT/9oADAMBAAIRAxEAPwD24Trhsga8xsgKzy2QNeY2QDp0w20QNeY2QDpyOGyBrpsg1dNkA2cstkDXmNkAJ1w2QNeY2QFZ5Z5IGvMbIAz02QNeY2QDpyOGyBrpsg1eY2QDZ6Z5IGvMbIATrhsga8xsgDOYwzyQNeY2QDp6ZZIGvMbIB05HDZA102QavMbIBs9M8kDXmNkBWeWWSBrzGyDV5jZAB2OOxQVe67FBN6uexQVe67FBLnYY7Hkgq912KCXOocdigq912KDXuuxQDXUz2KBvddigkOxx2KCr3XYoJvVzzyKCr3XYoBzuuxQN7rsUEudQ47FBV7rsUGvddiglruueRQVe67FBIdjjsUFXuuxQSXVGOeRQVe67FBLndcsigq912KCXOocdigq912KDXuuxQS13XPIoKvddigm9XPLIoKvddig17rsUGGaBQGaBQS7Lr8EFIB+BQKDIBuCBQAzQKAzHvQKAcgUA/AoFBkA35oFADNAoJOI6H4IKQDvkgUA/AoFBkA35oFAZn3IFBkEgY1KBlqUEyriUFS1KCXDCp+ggqWpQDhQ1KBlqUGlqUA0UxKBlqUABjUoGWpQEq4nNAy1KAI1KBlqUA4UNSgZalBpalANGpzQMtSgAMalAy1KCSKipzQVLUoBw1OSBlqUA4UNSgZalBpalANGpzQMtSgJVxOSBlqUGlqUEg40PZBU9D2QTOuB7IKnoeyCXHCh7ckFT0PZBLjQ0PZBU9D2Qaeh7IBppgeyBnoeyCQcaHsgqeh7IJnXA58kFT0PZAOOh7IGeh7IJcaGh7IKnoeyDT0PZBLToc+SCp6HsgkHGh7IKnoeyCSaihz5IKnoeyCXHQ5ckFT0PZBLjQ0PZBU9D2Qaeh7IJadDnyQVPQ9kEzrgcuSCp6Hsg09D2QYZoFAZoFBLsuvwQUgHYFAoMgG4IFADNAoDMe9AoByBQDsCgUGQDfmgUAM0Cgk4jofggpAO+SBQD8CgUGQDfmgUBmfcgUGQQGitBsgq6OQ2QTdE8Bsgq6OQ2QS5opQbaIKujkNkEuaJGg2QVdHIbINdHIbIJa0SwGyCro5DZBIaK0GyCro5DZBN0TFBnkgq6OQ2QS5o5DZBV0chsglzRI0GyCro5DZBro5DZBLWjkM8kFXRyGyCQ0VoNkFXRyGyCS0TFBnkgq6OQ2QS5o5DLJBV0chsglzRI0GyCro5DZBro5DZBLWjkM8kFXRyGyCbongMskFXRyGyDXRyGyAE64bIGumyCazy2QVXTZBLp0w20QVXTZAOnI4bIGumyDV02QDZ6bIGumyCROuGyCq6bICs8s8kDXTZAOnpsga6bIB05HDZA102QaumyAbPTPJA102QAnXDZA102QSZzGGeSCq6bIB09MskHy+MeIrLYf4VHhwnYiHV0QjmGNm6XuVlMV7/DCu+WlPil8B3mbw+cr8WX6XoPl8+yu9zy+Sj33D5vv8H8RWW3fwWPDiuxMOrIgHO46TpayVN8V6fFC+mal/hl9WumyrWBs9M8kDXTZAVnllkga6bINXTZBIdjjsUFXuuxQTernsUFXuuxQS52GOx5IKvddiglzqHHYoKvddig17rsUA11M9igb3XYoJDscdigq912KCb1c88igq912KAc7rsUDe67FBLnUOOxQVe67FBr3XYoJa7rnkUFXuuxQSHY47FBV7rsUEl1RjnkUFXuuxQef+ZHjg2L9xWMj7SQDGi4/Z2moAH6ZFa4CXMS26XTcfWt2fqw6vVdH1a9v6PHYsRz3F7y573G857yXOceZJqSutERHKHHmZmd5SjxUKI5hD2Ese03mvYS1zSMCCKgpMRPKXsTMTvD2Dy38cm2EWG2mdpAJgxsPtDRUtI/TArqAcxXlarTcHWr2fo6+k1XSdW3b+r0BruueRWFvVe67FBN6ueWRQVe67FBr3XYoMM0CgM0Cgl2XX4IKQD8CgUGQDcECgBmgUBmPegUA5AoB+BQKDIBvzQKAGaBQScR0PwQcfidsFmgxrQ+rYDHxnDmGi9LspUrxWiI8UbW4azPk/NNstT48R8aKb0SK50R7ubnGZX0FaxWNofOXtNrTaXL4DweLxCM2zWe4Ijg5w9QlrZNEzUAqGTJGOvFKWLFOW3DDs58rLfzs3967/Ks/v2L82r+35POHWOPcGi8PjGzWi4YjQ159MlzZOqKkBaMWSMleKGbLinFbhlxLLaXQXsjQjdiQnNiMdyc0zB7KdqxaNpQraazEw/SnCLaLVAg2ltGx2NigcrwnL3Tkvn714bTXyfR0txVi3m5iikMz7kCgyCQMcUDLqgJVzQMuqCXDDHH4IKl1QDhQ4oGXVBpdUA0UzQMuqAAxxQMuqAlXPNAy6oBwwxQMuqAcKHFAy6oNLqgGjrmgZdUABjigZdUEkVGOaD4Pj4H8HWy7OfpnaYn2mrtP3tfVTqO6t6Pz2u6+edw8p/4xhf0I37Kya3um3Qd69zcKHFcd2nhvm1/GL/6uD/guxou6cXX966ctbE/QXl6D+DrHOc7h2vGXaS4ep72z6DTd1V2KXVULxKueSBl1QaXVBIOND2QVPQ9kEzrgeyCp6Hsg8S8b8Tt3D7dFhstVpEMkWiA10V5b6b6hsp1aDebL+auvp6Y8mOJmsOPqcmXFl2i07PYeD8Rba4EG0sBux2NiAU9kkVb1BmPcuVes0tNZ8HVpeL1i0eLzrzZ8TxoEaDZLLFiQDDaY0d0J5YXF1GMJHIAmX84LfosNbVm1oYNdntWYrWdnfvDVmiwLLAh2l0SNHDQ6M+K6+71He05szkCZDQLFltFrzNexuxVmtIie19Oeh7KtYlppgeyDicZ4m2xQYtqite6HBF5wh3S4icqAkDPmp0pN7RWPFG94pWbT4Pm+FPFkHivrGzsjM9Asv8ArNhtnfnKV1x/QPZTzYLYtuLxVYdRXLvw+D789D2VK9M64HPkgqeh7IOn+aVvi2exepZ3xID/AFYbb8NxY66QZiYWrSVi2TaYZdZaa496y824RaeMW4OdZI1sjNhkNeWx5XSage0Qt9409OVoj7Odjtqckb1mXO4P45t3D4/ocRdEiw2kMtEK0D8bCB/Pa7EmRBrMEdZqGTS48ld6J49Xlx34cj2q9oey5LsGeh7IJadDnyQVPQ9kEg40PZB1nzJtkSBw+NFgufBiNdBuxIbixwm9oNRXCi0aWsWyxE/zkz6q01xTMON5ZeIIvELO42k+pFs7jCMWQBiNIDmk61I9wUtXirjv1eyUdJmtkpvbth2jiVkFphRbO8G7HY+C40oHi6T3WetuGYmPBotXiiYnxeTwvA9k4e0RONWkXzUWWzGrh+24dAJc1uy6/wAKR91Gi9iZc88omf0+8uTZvFvD7AZ8OsHttm1saM5rHyNDJ3tukeoWG+ovf4pfSaf+muH4rRHpG8/52f2PmnG/4aFL+udP9lVcbZ/YMf8A6T9v+v42nxdw+3mfEbB7bpNMaC5r3yGHt+w6Q6q2movT4ZY9R/TXF8Non1jb9N3Gi+B7HxBpicFtIvj2jZbSat/82jUgz5rbi1/hePs+c1nsTLgnnEx/mPu9W4TZBZoMGzsBuwGNhA0rdEp++SxXtNrTafFdSvDWIjwcueh7KKSZ1wOXJBU9D2Qaeh7IMM0CgM0Cg8485+EepBg25o9qzu9KKf8AlRMCejgB/bK36HJtaa+bn+0Me9Iv5J8nuNj7PHskVwaLITaGF2AgOq73BwJP9MJrsfXi0eJoMu9JrPg6p4eaeMcVNpig+mHutsUH82DDl6bDz/3bd1py/g4OGPRmxfjajin1dq8DeMrTxPiERkRwZZfTixIVna1smyc0NJd94uka1loFm1GnrixRMdrTp9TbLlmJ7HA4940tvEbSbDwabWAua2JDu341370QvNGM5YZVrITx6bHjpx5VeTU5Ml+DE4cfjPGOBvhutjnR4MQ/divEaHE5tET7zHS/+GSnGPBnjq8pRnLqMExx84fX8wuJ2m22SDarBfPD40JzrZ+9+ybwAa6dZghw9nkqtNSlLzW/xR2LtVe98cWp2T2uteWht3rj7Fe+zepA+33fTl6czKd6uF/7q0avo+HrdvPZl0fScXV7OW7tL/Gloj8Xh2GE4QrLDius72BrS6MWAhxc4iY9oGUpUWb3etcHHPa1e82tqOCOx8Tjvje32a32iFDimJDhRXw4dnMNhaRg1tBeNZZzMldj02O2KJmFOXVZaZZrD5/E+N8ZsL2RrVEtEExfaYIgb6TpYtuD2R0kCp0xae8bViFd8upxzvaXZfGnGvwjwWDapBjnxWNiMGDYjbzXS0MpjQhZ8GPo9RNWnUZOk03E6z4H8ajhDI0MwTH9ZzXzET07shKWBmtOo03SzE77Mum1UYazG27i2u2fh63tfGdCsbI1yH7b6MhtpdDj955rLCZOS9ivQYuXN5NveMvPk9S8wvFn4KhMZBAdaY8xCvVbCY3GIRniAB8pLnabB0tufZDparUdFXl2y83sfFeNRwbZBfbYrGzN9jb0IyxlDlddLQLfamnr1Z2c+uTU2jjjdyeEeO7fabZZmOjXIUaNZ4b4LGQ7t1zmtcASLwBmc815fS4645nbnESlj1mW2SI35TMOb4v8aW2xcRjQoUU+hAfCIgFkO65t1riwulekSTnOqhg02O+KJmOcp6jVZMeWYieT5fF+NcaszmWq0vtNnEUzhzDWwp4hnp/dBlk4Tp1VlMent1a7SqyZdTTrW5Oz8d8QHifAotoeA2K18KDHDfu+o2IwzGhDmmWU1nx4ui1MV/nY1ZM3S6abPm+XniCFwyw2u0RfacYoZBhAydGiXBJo5Dmchsp6rFOTLWseSrSZYxYZtPm5HgvifFeLx3PNodBskN16M5kOEAJ1EGHNprLnOQqakT81FMOKu23NLT5M+a2++0Pv+PvBn2z912QD7U0BsRhkPtLRQVODwKAnEU5Ll2jd9b7L9p9B+Fl+Hw/L/jyeNCdDc6HEa6HEYZPY8FrmnkQahVvq62i0Ras7xKEergwnRHNhw2ue95kxjAXOceQAqUeWtFYm1p2iHrHgDwYbHK2WsD7SQRCh0cLO041zeRSmApmVZWuz5X2p7T6f8LF8PjPn/wAd3b81JxCgMz7kCgyCA0VoNkFXRyGyCbongNkFXRyGyDg8Z4cy1wItmfINjtdDnL7pIMnDUGR9ylS00tFo8EL0i9ZrPi/OrI0WxvjwgfTeWxbHaG4+yTJ7N2rvTFbxE/WHz8WtjmYj0eo+U3CPSsdotjx7VqvMhz/kYcxP3uv/APSFztbk3vFfJ1NDj4cc283UfKtjnWmM1n33WW0Bn9I3Zd1p1nwRv5wy6LvJ9JcDwTYrXaIz4fDozbNHuEuL3uhl8METaCAZ1umSs1Fsda73jeFemrktaYpO0uw8e8M8TMNreI26yNgucCwWq1FjTEAOF5orIlZ8WbDvvSs7/lDRlwZpja942/N9mDw11l4DaobokG0A+o+HFssT1oRYXCYDpVk4OmqpvFtTE7beq6KTTTTG+/o4vklFbO2wyW33eg9rCRNzRfBIGcpjcKftCJ6s+qv2dMdaPR8PhY/Lx/W7T+09XX+W+kKcfzU+sojj8uyy+2Mp/bCR8t9Cfmvq7n50tH2KBQfwhn/biLLoO8n0a/aHdR6uqxh/s/D/AFk/4uWiPmp9GaflI9X0vKXg9mtUG0utUGDHcx7QwxWNcWi7gJqvW5L1tHDOyzQ46WpPFD5Hmrw2yWW0Qm2IMhucwm0QYR9hhmLhl+aSL1NAc626O97Vni+inXUpW0cLg+OHRHt4ZFi3j6ligSc785wc6Z1JBYZ6qem2jjiPOUNVvMUmfJ7L4VtMCJY7NEgFggshsaaj8WWt9pruRBnNcrNW0ZJie118Nqzjia9jxhsaHF4wyJZ5GC+2wnQy37rmmKPaGhqfeuttMafa3bt/pyN4nU717N3N8Vj8uOGRj2QSylKGoYflvpP+083zX1h33zbaPwe+g/fIKxaLvYbtb3MukcLH5At360z/ANK2X+ar6fuxY/lLev7OpDh8QwDawJwWRPQeRP2HkBwJ5A4T5jotPHHHw+LJ0duDj8HtPljxeBarGyBCYyDFsoEONBbmThFGZvVJ1n1PJ1eO1cm8+Ls6TJW+OIjls7c5o5DLJZWpw+J8Fs9rErTBhxZUDnNF5vRwqPcV5svw6nLhn8O0x/PJ8N3l7w6p9F/T148v2przhht/vOs2+KPtH7Pt8M4JZrGJWaDDhToXNb7bhq41PvK9iNmLNqc2bvLTP88uxz7o5DZeqEtaOQzyQVdHIbIJuieAyyQVdHIbINdHIbIATrhsga6bIJrPLZBVdNkEunTDbRB5x4r8t4tttj7TBiQYMCPddFvXi9kSUnFrAJGcgauFSVvw6yKY+GY5w5+fRTkycUTyl3yycPbZ4DbLCoyFDEJk8ZASmTzWK1ptbilurWK14YdH8AeBbVwy0m0Wh9ncww3wpQnxHOvEtIoWinsnNbNTqaZKcNd2LTaW+K82mYT4p8uoro5t3CoggRXOMR0IudCuxDi+G9s5TmaHma5L3Dq4ivBkjeHmbRzN+PHO0vnQPL3iFvitfxW0fi2Un6hjxLubWD7rZ8+xU51eLHG2OEPc8uS2+Wz0s8Kheh9iutFmLDZ/SEwPTIuynjOWeK5/Hbi4vF0eCvDw+Dzrh/ljHstsgWiFGgxbPAiw4v4y+yLcaQ6UgCCZZzE9Fvtra2xzWY5y59dDamSLRPJy7F4DtUPiZ4i59n9Ex41puh8T1Ljy4gSuyn7QzUbaqk4eDnvslTS3jN0m8bbymL4CtR4n+EL9n9H7Q21Xb8T1PTDgSJXZTlr70jVU6Hg577E6W/TdJy23dh8wvDsbilnhwLO6E17IrYxMYuY26GubQgGs3jJU6bNXFaZt5L9VhnLThh8OJ4HtJ4Wzht6z+u2MYxdff6dypxuznXkrY1NOm6TntsqnTW6Do/F1o+U1u/lLH/eRf8i0e/4/Kf59WX+35POH1OC+UzmuD7dGhljamDZrx9TQvMpDoJ6hV5Nfy6kfdbj9n897z9ncvF/hKHxOA2DMQYkCtmiNbSHSRYR+iQBTQclkwZ5xW38+1sz6euWu32eat8sOIhxhzgBjpXniMfTIGZEpnZdD33F283O9xy9m8PrcO8sbTZ7VAjsi2d8GzxYMUlzntiOaxwc72Q0gGhkJ8qqq2tpakxMTvO6ymhtXJExPKHP434CtVo4keIMfZxBMWBGuufEES7DDQaBpE/ZOahj1VK4eCd9+a3Jpb2zdJExtydm8c8Di8RsrrNAMNry+G+cUua2TamoBPZZ9PkjHfilo1GOcmOaw65YvAtqh8LtPDXPs/rx4zY7HBzzDDB6dCbs5/i3ZclfbU0nNGTntEfuz10t4wTj5by53g/wW+y2W1WK3mFFZaySRBLnANkBObgJOBEx0Chn1EWvF6eCen000xzS/i+HwHwBxHhtpbabNFsrgwlpa98VnrwSatcAwymADnIgYyV+TVYslOG0T/PqoxaTLivxVmHqJnplkua6aq6bIB05HDZA102QaumyAbPTPJA102QFZ5ZZIGumyDV02QSHY/IoKvfUigm9X/QoKvfUiglzsPkeSCr31IoJc6h+RQVe+pFBr31IoJa6n+hQVe+pFBIdj8igq99SKCb1d8igq99SKCXO+pFBV76kUEudQ/IoKvfUig176kUEtd8cigq99SKCQ7H5FBV76kUEl1R78igq99SKCXO+GRQVe+pFBLnUPyKCr31IoNe+pFBLXfHIoKvfUigm9XbIoKvfUig176kUGGaBQGaBQS7Lr8EFIB+BQKDIBuCBQAzQKAzHvQKAcgUA/AoFBkA35oFADNAoJOI6H4IKQDvkgUA/AoFBkA35oFAZn3IFBkEAY1KCpalBMq4lBUtSglwwqfoIKlqUEuFDUoKlqUGlqUEtFMSgqWpQSBjUoKlqUEyric0FS1KAcNSgZalBLhQ1KCpalBpalBLRqc0FS1KCQMalBUtSgkioqc0FS1KCXDU5IKlqUEuFDUoKlqUGlqUEtGpzQVLUoJlXE5IKlqUGlqUADjQ9kDPQ9kEzrgeyCp6Hsglxwoe3JBU9D2QDjQ0PZAz0PZBp6HsgGmmB7IGeh7IJBxoeyCp6HsgmdcDnyQVPQ9kA46HsgZ6HsglxoaHsgqeh7INPQ9kEtOhz5IKnoeyABxoeyBnoeyCSaihz5IKnoeyAcdDlyQM9D2QDjQ0PZAz0PZBp6Hsglp0OfJBU9D2QE64HLkgZ6Hsg09D2QYZoFAZoFBLsuvwQUgHYFAoMgG4IFADNAoDMe9AoByBQDsCgUGQDfmgUAM0Cgk4joUFIB3yQKAdgUCgyAb80CgMz7kCgyCA0VoNkDcHIbIC6J4DZA3ByGyAc0UoNtEDcHIbIBzRI0GyBujkNkGujkNkA1olgNkDcHIbIANFaDZA3ByGyAuieAzyQNwchsgC0chsgbg5DZAOaJGg2QNwchsg1wchsgGtHIZ5IG4OQ2QAaK0GyBuDkNkAWiYoM8kDcHIbIBzRyGWSBuDkNkA5okaDZA3RyGyDXByGyAa0chnkgbg5DZAXRPAZZIG4OQ2Qa4OQ2QAnXDZBVdNkE1nlsgqumyCXTphtogqumyCXTkcNkFV02QaumyAbPTZA102QSJ1w2QVXTZBNZ5Z5IKrpsgHT02QNdNkEunI4bIKrpsg1dNkEtnpnkgqumyCROuGyCq6bIJM5jDPJBVdNkEunplkgqumyCXTkcNkFV02QaumyCWz0zyQVXTZBNZ5ZZIKrpsg1dNkGGaBQGaBQS7Lr8EFIB+BQKDIBuCBQAzQKAzHvQKAcgUA/AoFBkA35oFADNAoJOI6H4IKQDvkgUA/AoFBkA35oFAZn3IFBkH/9k=",
  },
  {
    id: "techcombank",
    name: "Techcombank",
    logo: "data:image/png;base64,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",
  },
];

export default function PaymentTest() {
  const [selectedMethod, setSelectedMethod] = useState("CASH_ON_DELIVERY");
  const [selectedBank, setSelectedBank] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState("");
  const [fee, setFee] = useState(null);
  const [data, setData] = useState(null);
  const [note, setNote] = useState("");
  const navigiton = useNavigate();
  const [orderIds, setOrderIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = async () => {
    try {
      if (selectedMethod === "CASH_ON_DELIVERY") {
        for (const id of orderIds) {
          const res = await orderService.conformOrderRoot({
            orderCode: id,
            paymentType: selectedMethod,
          });
          console.log(`Xác nhận đơn hàng ${id} thành công:`, res.data);
        }

        setIsModalOpen(false);
        localStorage.removeItem("cart"); // ✅ Xóa giỏ hàng
        setCartItems([]);
        navigiton("/settings/buylist");
      }

      if (selectedMethod === "ONLINE_PAYMENT") {
        for (const id of orderIds) {
          const res = await orderService.conformOrderRoot({
            orderCode: id,
            paymentType: selectedMethod,
          });
          console.log(`Xác nhận đơn hàng ${id} thành công:`, res.data);
        }

        setIsModalOpen(false);
        localStorage.removeItem("cart");
        setCartItems([]);
        navigiton("/wait-for-payment", { state: { orderIds } });
      }
    } catch (err) {
      console.error(
        "Lỗi khi xác nhận đơn hàng:",
        err.response?.data || err.message
      );
      alert("Có lỗi xảy ra khi xác nhận đơn hàng.");
    }
  };

  const handleCancel = async () => {
    try {
      await Promise.all(orderIds.map((id) => orderService.cancelOrder(id)));
      console.log("Tất cả đơn hàng đã được hủy.");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      alert("Có lỗi xảy ra khi hủy đơn hàng.");
    }
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    setCartItems(storedCart ? JSON.parse(storedCart) : []);
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await appService.getProfile();
        setReceivers(response.data.metadata.addresses);
        setData(response.data.metadata);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchAddress();
  }, []);

  const handleSelect = (id) => {
    setSelectedBank(id);
  };

  const handleChange = (e) => {
    setSelectedMethod(e.target.value);
  };

  const getAddressCodesFromNames = async (
    provinceName,
    districtName,
    wardName
  ) => {
    try {
      const provinces = await getProvinces();
      console.log(districtName);
      const normalizeProvinceName = (name) => {
        return name
          ?.toLowerCase()
          .replace(/^tỉnh\s+/i, "") // Bỏ "Tỉnh "
          .replace(/^thành phố\s+/i, "") // Bỏ "Thành phố "
          .trim();
      };
      const province = provinces.find(
        (p) =>
          normalizeProvinceName(p.ProvinceName) ===
          normalizeProvinceName(provinceName)
      );
      if (!province) return null;

      const districts = await getDistricts(province.ProvinceID);
      const district = districts.find(
        (d) =>
          normalizeProvinceName(d.DistrictName) ===
          normalizeProvinceName(districtName)
      );
      if (!district) return null;

      const wards = await getWards(district.DistrictID);
      const ward = wards.find((w) => w.WardName === wardName);
      if (!ward) return null;

      return {
        district_id: district.DistrictID,
        ward_code: ward.WardCode,
      };
    } catch (error) {
      console.error("Lỗi khi tra cứu mã vùng:", error);
      return null;
    }
  };

  // Tổng giá trị sản phẩm
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Phí ship thực tế (nếu là số thì dùng, nếu là lỗi hoặc null thì là 0)
  const shippingFee = typeof fee === "number" ? fee : 0;

  // Giảm giá tạm thời (hardcode, bạn có thể xử lý thêm logic voucher sau)
  const discount = 20000; // Hoặc 0 nếu chưa nhập mã

  // Tổng thanh toán
  const total = subtotal + shippingFee - discount;

  useEffect(() => {
    const fetchFee = async () => {
      if (!selectedReceiverId) {
        setFee(null);
        return;
      }
      const selectedReceiver = receivers.find(
        (r) => r.id === Number(selectedReceiverId)
      );

      if (!selectedReceiver) return;

      console.log(selectedReceiver);
      const addressCodes = await getAddressCodesFromNames(
        selectedReceiver.province,
        selectedReceiver.district,
        selectedReceiver.ward
      );

      console.log(addressCodes);

      if (!addressCodes) {
        setFee("Lỗi");
        return;
      }

      try {
        const res = await calculateShippingFee({
          to_district_id: addressCodes.district_id,
          to_ward_code: addressCodes.ward_code,
          weight: 500,
          length: 20,
          width: 15,
          height: 10,
        });
        setFee(res);
      } catch (error) {
        console.error("Lỗi tính phí:", error);
        setFee("Lỗi");
      }
    };

    fetchFee();
  }, [selectedReceiverId, receivers]);

  const handleOrder = async () => {
    if (!selectedReceiverId) {
      alert("Vui lòng chọn người nhận");
      return;
    }
    if (selectedMethod === "card" && !selectedBank) {
      alert("Vui lòng chọn ngân hàng");
      return;
    }

    const selectedReceiver = receivers.find(
      (r) => r.id === Number(selectedReceiverId)
    );
    const shippingAddress = selectedReceiver
      ? `${selectedReceiver.name}, ${selectedReceiver.phone}, ${selectedReceiver.detail}, ${selectedReceiver.ward}, ${selectedReceiver.district}, ${selectedReceiver.province}`
      : "";

    // Nhóm cartItems theo shopId
    const groupedByShop = cartItems.reduce((acc, item) => {
      if (!acc[item.shopId]) {
        acc[item.shopId] = [];
      }
      acc[item.shopId].push(item);
      return acc;
    }, {});

    try {
      const orderCodes = [];

      for (const shopId in groupedByShop) {
        const items = groupedByShop[shopId];

        const orderData = {
          orderItems: items.map((item) => ({
            productVariantId: item.variantId || item.id,
            quantity: item.quantity,
            version: item.version || 1,
          })),
          shopId: parseInt(shopId),
          shippingFee: total, // Nếu cần chia phí ship theo shop thì tính lại tại đây
          voucherUserId: null,
          voucherCode: null,
          note: note,
          customerName: data.lastName,
          customerPhone: data.phone,
          shippingAddress: shippingAddress,
        };

        const response = await orderService.postOrder(orderData);
        console.log(response);
        orderCodes.push(response.data.metadata.orderCode);
      }

      setIsModalOpen(true);
      setOrderIds(orderCodes); // Nếu muốn lưu nhiều orderId
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err);
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };
  return (
    <div className="payment-page">
      <div className="payment-container2">
        {/* Thông tin đơn hàng */}
        <div className="form-section">
          <h2>Thông tin đơn hàng</h2>

          {receivers.length === 0 ? (
            <p style={{ color: "black" }}>
              Bạn chưa có địa chỉ nhận hàng nào. Vui lòng{" "}
              <Link to="/settings/address">thêm địa chỉ</Link> để tiếp tục.
            </p>
          ) : (
            <select
              value={selectedReceiverId}
              onChange={(e) => setSelectedReceiverId(e.target.value)}
              style={{
                marginBottom: "12px",
                padding: "10px",
                borderRadius: "5px",
                width: "100%",
                outline: "none",
              }}
            >
              <option value="">Chọn người nhận</option>
              {receivers.map((receiver) => (
                <option key={receiver.id} value={receiver.id}>
                  {`${receiver.name} - ${receiver.phone} - ${receiver.detail} / ${receiver.province} / ${receiver.district} / ${receiver.ward}`}
                </option>
              ))}
            </select>
          )}
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú đơn hàng (nếu có)"
          />

          <h3
            style={{
              margin: "2% 0",
            }}
          >
            Phương thức vận chuyển
          </h3>
          <div className="shipping-fee">Phí ship đơn hàng {fee || "0"}Đ</div>

          <h3>Hình thức thanh toán</h3>
          <div className="payment-method">
            <label
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "2%",
                  borderBottom:
                    selectedMethod === "CASH_ON_DELIVERY"
                      ? "1px solid #ccc"
                      : "none",
                }}
              >
                <input
                  style={{ width: "10%" }}
                  type="radio"
                  name="payment"
                  value="CASH_ON_DELIVERY"
                  onChange={handleChange}
                  checked={selectedMethod === "CASH_ON_DELIVERY"}
                />
                <span style={{ width: "90%" }}>
                  Thanh toán khi nhận hàng (COD)
                </span>
              </div>
              {selectedMethod === "CASH_ON_DELIVERY" && (
                <ul style={{ padding: "1% 5%", margin: "0" }}>
                  <li>Khách hàng được kiểm tra hàng trước khi nhận hàng.</li>
                  <li>Freeship đơn từ 250k</li>
                </ul>
              )}
            </label>
            <label
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "2%",
                }}
              >
                <input
                  style={{ width: "10%" }}
                  type="radio"
                  name="payment"
                  value="ONLINE_PAYMENT"
                  onChange={handleChange}
                  checked={selectedMethod === "ONLINE_PAYMENT"}
                />
                <span style={{ width: "90%" }}>Thanh toán Momo</span>
              </div>
            </label>
            <label
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "2%",
                  borderBottom:
                    selectedMethod === "card" ? "1px solid #ccc" : "none",
                }}
              >
                <input
                  style={{ width: "10%" }}
                  type="radio"
                  name="payment"
                  value="card"
                  onChange={handleChange}
                  checked={selectedMethod === "card"}
                />
                <span style={{ width: "90%" }}>Thẻ tín dụng / ngân hàng</span>
              </div>

              {selectedMethod === "card" && (
                <ul
                  style={{
                    padding: "1% 5%",
                    margin: 0,
                    display: "flex",
                    gap: "30px",
                    listStyle: "none",
                    flexWrap: "wrap",
                  }}
                >
                  {bankList.map((bank) => (
                    <li key={bank.id} style={{ textAlign: "center" }}>
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        style={{
                          height: 40,
                          objectFit: "contain",
                          marginBottom: 6,
                        }}
                      />
                      <div>
                        <input
                          type="radio"
                          name="bank"
                          value={bank.id}
                          checked={selectedBank === bank.id}
                          onChange={() => handleSelect(bank.id)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </label>
          </div>
        </div>

        {/* Giỏ hàng */}
        <div className="cart-section">
          <h2>Giỏ hàng</h2>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
                marginBottom: "10px",
              }}
              className="cart-item"
            >
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <p
                  style={{
                    color: item.quantity > 0 ? "black" : "red",
                    margin: "0",
                  }}
                >
                  {item.quantity > 0 ? item.name : item.name + " (Hết hàng)"}
                </p>
                <p style={{ color: "black", margin: "0" }}>
                  Giá: {item.price.toLocaleString()}đ
                </p>
                <p style={{ color: "black", margin: "0" }}>
                  Số lượng: {item.quantity}
                </p>
              </div>
            </div>
          ))}

          <h3>Ưu Đãi Dành Cho Bạn</h3>
          <div className="voucher-box">
            <input placeholder="Nhập mã giảm giá" />
            <button>Áp dụng</button>
          </div>
          <div className="voucher-list">
            <span>XMARK</span>
            <span>XMARK</span>
            <span>XMARK</span>
          </div>

          <div className="summary">
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString()}đ</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee.toLocaleString()}đ</span>
            </div>
            <div className="summary-row">
              <span>Giảm giá đơn hàng:</span>
              <span>-{discount.toLocaleString()}đ</span>
            </div>
            <div className="summary-row total">
              <strong>Tổng:</strong>
              <strong>{total.toLocaleString()}đ</strong>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "0",
          width: "100%",
          boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          left: "0",
        }}
        className="place-order"
      >
        <div
          style={{
            display: "flex",
            alignContent: "center",
            marginLeft: "5%",
            width: "60%",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              margin: "0",
              color: "black",
              fontSize: "18px",
              borderRight: "1px solid black",
              padding: "3% 20% 3% 5%",
            }}
          >
            {selectedMethod === "CASH_ON_DELIVERY"
              ? "Thanh toán khi nhận hàng"
              : selectedMethod === "ONLINE_PAYMENT"
              ? "Thanh toán Momo"
              : "Thẻ tín dụng / ngân hàng"}
          </p>
          <span style={{ fontSize: "18px", padding: "3% 0% 3% 0%" }}>
            Chưa dùng voucher
          </span>
        </div>
        <button onClick={handleOrder}>Đặt hàng</button>
      </div>
      <Modal
        style={{
          marginTop: "10%",
        }}
        title="Xác nhận order !"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p
          style={{
            color: "black",
          }}
        >
          Some contents...
        </p>
      </Modal>
    </div>
  );
}
