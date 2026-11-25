# MIGRATIONS

Registro vivo de migraciones de base de datos por ambiente.

> **Regla obligatoria para agentes de IA:**
> - Antes de crear o aplicar cualquier migración, lee este archivo completo.
> - Nunca adivines qué base de datos o migración falta por aplicar; consulta esta tabla.
> - Cada vez que crees una migración o la apliques en un ambiente (`Local`, `Test`, `Staging`, `Producción`), actualiza esta tabla inmediatamente.

## Ambientes configurados

| Ambiente | Base de datos / Proyecto | Método de aplicación | Notas |
| :--- | :--- | :--- | :--- |
| Local | - | - | - |
| Test | - | - | - |
| Staging | - | - | - |
| Producción | - | - | - |

## Estado de migraciones

Estados válidos: `Pendiente`, `Aplicada`, `No aplica`, `Rollback`.

| ID / Archivo | Descripción | Local | Test | Staging | Producción | Fecha / Notas |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| _Ejemplo: `20260101_init.sql`_ | _Esquema inicial_ | Aplicada | Aplicada | Aplicada | Pendiente | _Falta aplicar en prod_ |

## Pendientes críticas por aplicar

- **Test:** Ninguna registrada.
- **Staging:** Ninguna registrada.
- **Producción:** Ninguna registrada.
