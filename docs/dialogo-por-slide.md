# Diálogo por slide — Escalamiento de Conpro

> Texto literal del diálogo. Cada **[Slide N]** marca en qué slide va lo que sigue.

## Introducción

**[Slide 3]**
Juan tiene 40 años, vive en Providencia y es papá de dos hijos. Representa al cliente objetivo de Conpro: hogares de ingresos medios a altos, ubicados en comunas urbanas de la Región Metropolitana, que planifican sus compras y buscan optimizar su gasto.

Cuando compra alimentos para su familia, Juan no solo mira el precio; también le importa la calidad, el origen y la confianza de lo que lleva a su casa. Sin embargo, muchas veces esos productos de mejor calidad tienen precios elevados, por lo que debe elegir entre pagar más por productos premium o comprar alternativas más baratas que no siempre cumplen con lo que busca.

## Presentación de Conpro + Propuesta de valor

**[Slide 4]**
Ahí aparece Conpro: una iniciativa de comercio comunitario que actúa como intermediario entre hogares como el de Juan y proveedores de productos de calidad, permitiendo acceder a precios más justos en categorías donde normalmente ese equilibrio entre calidad y precio parece difícil de alcanzar.

## Análisis de mercado

**[Slide 5]**
Para entender qué tan atractiva es esta propuesta, comparamos los precios de los productos que ofrece Conpro actualmente con distintas alternativas del mercado. Este análisis mostró que Conpro no compite directamente con supermercados ni mayoristas, ya que estos suelen ofrecer productos, que, si bien son más económicos, son de menor calidad. Donde realmente aparece su competitividad es frente a tiendas naturistas y especializadas, que ofrecen productos de similares a los de Conpro, pero generalmente a precios más altos.

## Funcionamiento actual

**[Slide 6]**
Ahora, la pregunta es: ¿cómo funciona actualmente?

Hoy Conpro opera a través de una comunidad de WhatsApp, que se divide en distintos grupos según el tipo de producto, así, cada persona puede integrarse solo a los grupos de los productos que realmente le interesan.

Dentro de cada grupo, Ricardo, fundador de Conpro, comunica cuál es la disponibilidad del proveedor para esa semana, indicando el producto ofrecido, sus condiciones y el volumen mínimo necesario para concretar la compra. A partir de esa información, las personas interesadas se inscriben en el pedido colectivo. Si se alcanza el mínimo definido por el proveedor, la venta se concreta y luego se coordina la entrega, ya sea mediante despacho a domicilio en algunos casos específicos, o a través de un punto común de retiro para el resto de los productos, que actualmente, es la conserjería de Ricardo.

**[Slide 7]**
Este funcionamiento permite mantener una operación cercana y flexible, pero también genera una alta dependencia del fundador. Actualmente, toda la gestión pasa por Ricardo: reunir pedidos, enviar órdenes de compra a proveedores, recibir transferencias, revisar comprobantes, validar pagos y transferir los fondos correspondientes.

## Costo de oportunidad

**[Slide 8]**
En total, Ricardo dedica cerca de 4 horas semanales a estas tareas administrativas, es decir, aproximadamente 16 horas al mes. Considerando que Conpro genera cerca de $88.000 mensuales de ingreso líquido, esto equivale a alrededor de $5.500 por hora dedicada al negocio. Al compararlo con su costo de oportunidad, estimado en $16.700 por hora según lo que obtiene en otras actividades laborales, se vuelve evidente que existe una oportunidad importante de liberar tiempo operativo y redirigirlo hacia actividades de mayor valor.

## Caso base optimizado

**[Slide 10]**
Con este diagnóstico, el primer paso no es cambiar por completo el modelo, sino mejorar aquello que hoy genera mayor carga administrativa. Por eso construimos el Caso Base Optimizado, cuya lógica es mantener la comunidad de WhatsApp y la compra colectiva, pero automatizar los pagos mediante Fintoc. Para esto, se propone una plataforma web simple y de bajo costo que permita generar links de pago por pedido y registrar automáticamente las transacciones, facilitando la identificación de clientes pagados y pendientes.

El CBO requiere una inversión inicial de $295.000, asociada principalmente a la formalización de la marca y la elaboración de términos y condiciones. El ahorro operativo, en cambio, proviene de Fintoc, que reduciría aproximadamente 2,5 horas semanales de trabajo administrativo. Ese tiempo podría reinvertirse en difusión y captación de nuevos clientes, especialmente considerando que hasta ahora el crecimiento de Conpro ha sido orgánico y basado en recomendaciones boca a boca.

**[Slide 11]**
Para evaluar esta alternativa, modelamos los flujos con un WACC de 27% y una proyección de demanda que incorpora estos esfuerzos de difusión durante los años 2 y 3. Esto se debe a que, al dedicar 2,5 horas semanales a contactar potenciales clientes, Ricardo agotaría razonablemente su círculo cercano en un período de dos años; desde entonces, este canal dejaría de generar crecimiento adicional.

Los resultados muestran que el CBO mejora la operación actual. Al año 5, Ricardo podría generar cerca de $126.850 mensuales, un 20% más que bajo el modelo actual. Además, su ingreso por hora aumentaría de $5.500 a $7.930. Si bien este valor sigue por debajo de su costo de oportunidad, estimado en $16.700 por hora, evidencia que el CBO permite capturar más valor mediante una intervención de bajo costo.

## Modelación del proyecto

**[Slide 12]**
Aun así, Conpro seguiría enfrentando un techo operacional. El crecimiento continuaría dependiendo de la difusión que Ricardo pueda realizar, de su capacidad de coordinación y de un punto de retiro con capacidad limitada. Por lo tanto, el CBO mejora la situación actual, pero no resuelve completamente las restricciones estructurales que limitarían su crecimiento futuro.

**[Slide 14]**
Por eso surge el proyecto de escalamiento: una plataforma digital B2C que permita ampliar la base de clientes, reducir la dependencia del fundador y sostener el crecimiento del negocio en el tiempo.

La idea es trasladar el actual modelo de compra colectiva a una plataforma digital, donde los usuarios puedan unirse a grupos específicos para cada producto. Estos grupos permanecerán activos hasta alcanzar el volumen mínimo exigido por el proveedor para concretar la compra, momento en el que se habilitará el proceso de pago y se cerrará el grupo. Posteriormente, Conpro consolidará los pagos y realizará una única transferencia al proveedor.

De esta forma, se mantiene el componente comunitario que hoy caracteriza a Conpro, pero con una operación más escalable y menos dependiente de Ricardo.

**[Slide 15]**
Ante esta propuesta surge una pregunta evidente: ¿realmente vale la pena invertir en esta solución?

Para responderla, necesitamos ir más allá de la intuición y construir un modelo financiero que nos permita evaluar la rentabilidad del proyecto.

## Modelo financiero

**[Slide 17]**
Para esto debemos modelar la variable más importante y, al mismo tiempo, la más incierta: la demanda.

Para ello utilizamos una adaptación del modelo logístico discreto de difusión, que incorpora los principales factores que influyen en la expansión de Conpro. Entre ellos se encuentran la difusión boca a boca, la inversión en marketing para captar nuevos clientes y la tasa de fuga, que representa la pérdida de usuarios y está estrechamente relacionada con la calidad y funcionamiento de la plataforma.

Partimos de una base de 60 hogares activos, genrenado un ingreso bruto de $10MM anuales creciendo hasta un total de 37MM al quinto año lo que representa un x% del mercado potencial asociado a los hogares de RM.

## Costos

**[Slide 18]**
La inversión inicial, de $2.445.000, incluye el desarrollo de la plataforma digital, con un costo de $1.600.000, y los gastos legales.

En cuanto a los costos fijos, estos tienen un valor de alrededor de $310.000 anuales y contemplan la patente y el hosting y servidor de la plataforma.

Respecto a los costos variables, se considera una inversión en marketing financiada por la reinversión de utilidades. En la etapa inicial se destina un 50% para fortalecer el posicionamiento y la captación de clientes, porcentaje que disminuye a medida que la marca se consolida.

Finalmente, se considera el costo por venta, correspondiente al monto que se paga al proveedor por cada producto comercializado.

**[Slide 19]**
Considerando los ingresos estimados y la estructura de costos presentada, las ganancias anuales proyectadas son las que se muestran en la siguiente tabla:

## Indicadores de rentabilidad

**[Slide 20]**
Se utilizó una tasa de descuento del 29,59%, la cual refleja el riesgo asociado al modelo de venta de productos premium y alimentos a través de un canal online.

Se proyectaron flujos de caja a 5 años, considerando tres escenarios: pesimista, conservador y optimista, incorporando variaciones en la demanda.

A partir de ello, se obtiene el payback en cada escenario, así como el Valor Actual Neto (VAN), permitiendo evaluar la rentabilidad y el tiempo de recuperación de la inversión bajo distintas condiciones de mercado.

## Análisis de sensibilidad

**[Slide 22]**
Ahora, como el proyecto depende de supuestos con alta incertidumbre, hicimos un análisis de sensibilidad para entender qué variables realmente mueven el resultado. Sensibilizamos el ingreso anual por hogar, la tasa de fuga, la adopción, el nivel de interés y el WACC.

El principal hallazgo es que la rentabilidad depende sobre todo del ingreso anual por hogar, la tasa de fuga y el comportamiento efectivo de la demanda. Esto es clave porque se trata de variables difíciles de estimar con precisión en un negocio que todavía cuenta con poca información histórica.

En otras palabras, no basta con atraer usuarios a la plataforma: Conpro necesita que los hogares compren con frecuencia, se mantengan activos y tengan una buena experiencia para no abandonar el servicio. Por eso, aunque el proyecto puede generar valor, su rentabilidad no está completamente asegurada, lo que refuerza la idea de avanzar con cautela y usar el CBO como etapa previa para reducir incertidumbre antes de escalar. Creo que es muy pronto para sacar esa conclusión?

## Análisis de márgenes

**[Slide 23]**
Como el análisis de sensibilidad mostró que el ingreso anual por hogar es una de las variables que más mueve el VAN, evaluamos si Conpro tenía espacio para mejorar sus márgenes sin perder competitividad. Para esto, comparamos sus precios actuales con referencias de mercado y definimos precios máximos razonables por producto, buscando identificar en qué categorías todavía existe holgura para capturar más valor sin debilitar la propuesta comercial.

El análisis muestra que no todos los productos tienen el mismo potencial. Huevos y queso ya están cerca de su límite competitivo, mientras que café, vino y aceite de oliva presentan mayor espacio para aumentar margen. Este punto es relevante porque el impacto en el VAN es significativo: el café podría aumentarlo en cerca de $6,2 millones, el vino en $5,2 millones y el aceite de oliva en $1,2 millones.

## Análisis de flexibilidad

**[Slide 24]**
Si bien el análisis de márgenes muestra que existen espacios para mejorar el VAN, especialmente en productos como café y vino, estos ajustes no eliminan la incertidumbre principal del proyecto: la capacidad real de Conpro para sostener una base creciente de clientes. Por eso, además de evaluar cómo mejorar la rentabilidad del proyecto, también analizamos una segunda decisión clave: el momento óptimo para invertir.

En ese contexto, evaluamos la flexibilidad de esperar antes de lanzar la plataforma. La pregunta era: ¿qué pasa si Conpro no invierte inmediatamente, sino que primero opera bajo el CBO, valida demanda y acumula una base más grande de hogares activos?

Esta alternativa tiene sentido porque permite reducir incertidumbre y partir el proyecto desde una posición más sólida. Los resultados muestran que esperar puede generar más valor que invertir de inmediato: mientras lanzar hoy entrega un VAN de $2.386.311, esperar tres años alcanza un VAN traído al presente de $6.109.830.

Esto ocurre porque partir con más hogares activos acelera toda la curva de crecimiento posterior: hay más boca a boca, más ingresos y mayor capacidad de reinvertir en marketing.

**[Slide 26]**
DE igual manera, esta modelacion implica muchos supuestos debido a la falta de datos solidos del negocio para realizar proyecciones certeras sobre la demanda, por lo que Un analisis estrategico resulta sumamente importante. Así se identificaron las principales fortalezas amenazas oportunidad y debilidades de conpro.

**[Slide 27]**
INtegrando ambos analisis, las recomendaciones para este negocio son las siguientes:

- No realizar el proyecto, si bien el VAN es positivo, este es inferior al VAN asociado al Caso Base Optimizado. Esto implica que, aunque el escalamiento podría generar valor económico, no constituye la alternativa más conveniente desde el punto de vista financiero, ya que una opción de menor inversión, menor complejidad operativa y menor exposición al riesgo permite capturar un mayor valor esperado.

Hacer un calculo de cuantos hogares se necesitan para que sea viable
